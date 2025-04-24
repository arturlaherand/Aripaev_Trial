import { Box, Divider, Grid, Paper, Typography } from "@mui/material";

interface IVastusProps {
    netoPalk?: number;
    brutoPalk?: number;
    tööandjaKulu?: number;
    openAiHinnang?: string;
}

export const PalkVastus = (props: Readonly<IVastusProps>) => {
    return (
        <Box sx={{ maxWidth: 650, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Tulemused:
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant="body1" fontWeight="bold">
                            Netopalk:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.netoPalk} €
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="body1" fontWeight="bold">
                            Brutopalk:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.brutoPalk} €
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography variant="body1" fontWeight="bold">
                            Tööandja kulu:
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.tööandjaKulu} €
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box mt={2}>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        OpenAI hinnang:
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        {props.openAiHinnang}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};
