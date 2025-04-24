import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { IPalk } from '../Interfaces/IPalk';
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { JSX } from 'react/jsx-runtime';
import { muudaNumbriks } from '../Utils/NumberUtils';
import { arvutaLigikaudsedPalgad } from '../Utils/PalkUtils';

export interface IVorm {
    getRequest: () => IPalk | null;
}

interface IPalkVormProps {
    ref: React.RefObject<IVorm | null>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    laeb: boolean;
}

export const PalkVorm = (props: IPalkVormProps): JSX.Element => {
    const [töötukindlustus, setTöötukindlustus] = useState<boolean>(true);
    const [aktiivneKast, setAktiivneKast] = useState<"neto" | "bruto" | "kogukulu" | null>(null);
    const [palgad, setPalgad] = useState<{ neto?: number; bruto?: number; kogukulu?: number }>();

    const refs = {
        netoPalk: useRef<HTMLInputElement>(undefined),
        brutoPalk: useRef<HTMLInputElement>(undefined),
        tööandjaKulu: useRef<HTMLInputElement>(undefined),
        pensioniProtsent: useRef<HTMLInputElement>(undefined),
        töötuskindlustusmakse: useRef(true),
    };

    const handleTühjenda = () => {
        refs.netoPalk.current && (refs.netoPalk.current.value = '');
        refs.brutoPalk.current && (refs.brutoPalk.current.value = '');
        refs.tööandjaKulu.current && (refs.tööandjaKulu.current.value = '');
        setAktiivneKast(null);
        setPalgad({});
    };

    const handleInputChange = (field: "neto" | "bruto" | "kogukulu", pensioniProtsent?: string | null, arvestaTöötukindlustust?: boolean) => {
        const brutoVõiKogukulu = field === "bruto" ? refs.brutoPalk.current?.value : refs.tööandjaKulu.current?.value;
        const value = field === "neto" ? refs.netoPalk.current?.value : brutoVõiKogukulu;
        if (!value || isNaN(parseFloat(value))) {
            setPalgad({});
            setAktiivneKast(null);
            return;
        }
        
        if (!aktiivneKast) {
            setAktiivneKast(field);
        }
        
        const protsent = muudaNumbriks(pensioniProtsent ?? refs.pensioniProtsent.current?.value);

        setPalgad(arvutaLigikaudsedPalgad({
            tüüp: field,
            väärtus: parseFloat(value),
            pensioniProtsent: protsent,
            töötuskindlustusmakse: arvestaTöötukindlustust ?? töötukindlustus
        }));
    };

    const validateRequest = useCallback((): boolean => {
        return !!refs.netoPalk.current?.value || !!refs.brutoPalk.current?.value || !!refs.tööandjaKulu.current?.value;
    }, [refs.netoPalk, refs.brutoPalk, refs.tööandjaKulu]);

    const getRequest = useCallback((): IPalk | null => {
        return validateRequest() ? {
            netoPalk: muudaNumbriks(refs.netoPalk.current?.value),
            brutoPalk: muudaNumbriks(refs.brutoPalk.current?.value),
            tööandjaKulu: muudaNumbriks(refs.tööandjaKulu.current?.value),
            pensioniProtsent: muudaNumbriks(refs.pensioniProtsent.current?.value),
            töötuskindlustusmakse: töötukindlustus,
        } : null;
    }, [refs.netoPalk, refs.brutoPalk, refs.tööandjaKulu, refs.pensioniProtsent, töötukindlustus, validateRequest]);

    useImperativeHandle(props.ref, () => ({ getRequest }), [getRequest]);

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Palgakalkulaator</Typography>

            <Box component="form" onSubmit={props.onSubmit}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            inputRef={refs.netoPalk}
                            fullWidth
                            disabled={!!aktiivneKast && aktiivneKast !== "neto"}
                            onChange={() => handleInputChange("neto")}
                            label="Netopalk (€)"
                            type="number"
                            placeholder={palgad?.neto?.toString()}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }} />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            inputRef={refs.brutoPalk}
                            fullWidth
                            disabled={!!aktiivneKast && aktiivneKast !== "bruto"}
                            onChange={() => handleInputChange("bruto")}
                            label="Brutopalk (€)"
                            type="number"
                            placeholder={palgad?.bruto?.toString()}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }} />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            inputRef={refs.tööandjaKulu}
                            fullWidth
                            disabled={!!aktiivneKast && aktiivneKast !== "kogukulu"}
                            onChange={() => handleInputChange("kogukulu")}
                            label="Tööandja kulu (€)"
                            type="number"
                            placeholder={palgad?.kogukulu?.toString()}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }} />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            inputRef={refs.pensioniProtsent}
                            fullWidth
                            select
                            onChange={(e) => aktiivneKast && handleInputChange(aktiivneKast, e.target.value)}
                            label="Pensionisammas (%)"
                            defaultValue={"2"}>
                                {[0, 2, 4, 6].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}%
                                    </MenuItem>
                                ))}
                        </TextField>
                    </Grid>

                    <Grid size={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                defaultChecked
                                onChange={(_, value) => {
                                    setTöötukindlustus(value);
                                    aktiivneKast && handleInputChange(aktiivneKast, null, value)
                                }}
                            />
                        }
                        label="Arvestada töötuskindlustusega?" />
                    </Grid>

                    <Grid size={12}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={handleTühjenda}>
                            Tühjenda
                        </Button>

                        <Button type="submit" variant="contained" disabled={props.laeb}>
                            {props.laeb ? 'Arvutab...' : 'Arvuta'}
                        </Button>
                    </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};