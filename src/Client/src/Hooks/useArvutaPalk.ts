import { useMutation } from "@tanstack/react-query";
import { IPalk } from "../Interfaces/IPalk";

const errors = {
    errorMsg: "Palga arvutamine ebaõnnestus!"
}

export const useArvutaPalk = () => {
    return useMutation<IPalk, Error, IPalk>({
        mutationFn: async (request: IPalk) => {
            const response = await fetch("/api/palk/arvuta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(errors.errorMsg);
            }

            return response.json();
        },
    });
};