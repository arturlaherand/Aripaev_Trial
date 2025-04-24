export const muudaNumbriks = (sisend?: string): number | undefined => {
    if(sisend) {
        return parseFloat(sisend);
    }
};