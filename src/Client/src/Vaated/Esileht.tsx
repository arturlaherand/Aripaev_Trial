import { createRef, useState } from "react";
import { useArvutaPalk } from "../Hooks/useArvutaPalk";
import { IVorm, PalkVorm } from "../Komponendid/PalkVorm";
import { PalkVastus } from "../Komponendid/PalkVastus";
import { Alert } from "@mui/material";

export const Esileht = () => {
    const arvutaPalk = useArvutaPalk();
    const data = arvutaPalk.data;
    const [error, setError] = useState<string | null>(null);
    const refVorm = createRef<IVorm>();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const req = refVorm.current?.getRequest();

        if (!req) {
            setError("Netopalk, brutopalk või tööandjakogukulu peavad olema täidetud!");
            return;
        }

        setError(null);

        arvutaPalk.mutate(req, {
            onError: (error) => {
                setError("Midagi läks valesti. Palun proovi uuesti.");
                console.error("API Error:", error);
            }
        });
        if (req) {
            arvutaPalk.mutate(req);
        }
    };

    return (
        <>
            <PalkVorm ref={refVorm} onSubmit={handleSubmit} laeb={arvutaPalk.isPending} />

            {error && <Alert severity="error" sx={{ maxWidth: 650, margin: 'auto', mt: "1rem" }}>{error}</Alert>}

            {data && !error && (
                <PalkVastus
                    netoPalk={data.netoPalk}
                    brutoPalk={data.brutoPalk}
                    tööandjaKulu={data.tööandjaKulu}
                    openAiHinnang={data.openAiHinnang} />
            )}
        </>
    );
};

