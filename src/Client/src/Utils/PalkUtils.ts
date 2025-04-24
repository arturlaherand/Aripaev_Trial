import { MAKSUD } from "../Konstandid";

type Palgatüüp = "neto" | "bruto" | "kogukulu";

interface IPalgaArvutajaProps {
    tüüp: Palgatüüp,
    väärtus: number,
    pensioniProtsent?: number,
    töötuskindlustusmakse: boolean
}

export const arvutaLigikaudsedPalgad = (props: IPalgaArvutajaProps): { neto?: number; bruto?: number; kogukulu?: number } => {
    const pensioniMäär = props.pensioniProtsent ? props.pensioniProtsent / 100 : 0;
    const töötajaTöötuskindlustus = props.töötuskindlustusmakse ? MAKSUD.TÖÖTAJATÖÖTUSKINDLUSTUS : 0;
    const tööandjaTöötuskindlustus = props.töötuskindlustusmakse ? MAKSUD.TÖÖANDJATÖÖTUSKINDLUSTUS : 0;

    if (props.tüüp === "bruto") {
        const bruto = props.väärtus;
        const pension = bruto * pensioniMäär;
        const töötuskindlustus = bruto * töötajaTöötuskindlustus;
        const maksustatav = bruto - pension - töötuskindlustus;
        const tulumaks = maksustatav * MAKSUD.TULUMAKS;
        const neto = bruto - pension - töötuskindlustus - tulumaks;
        const tööandjaKogukulu = bruto * (1 + MAKSUD.SOTSIAALMAKS + tööandjaTöötuskindlustus);
        return { neto, kogukulu: tööandjaKogukulu };
    }

    if (props.tüüp === "neto") {
        let brutoHinnang = props.väärtus / 0.75;
        for (let i = 0; i < 10; i++) {
            const pension = brutoHinnang * pensioniMäär;
            const töötuskindlustus = brutoHinnang * töötajaTöötuskindlustus;
            const tulumaks = (brutoHinnang - pension - töötuskindlustus) * MAKSUD.TULUMAKS;
            const neto = brutoHinnang - pension - töötuskindlustus - tulumaks;
            const error = props.väärtus - neto;
            brutoHinnang += error;
            if (Math.abs(error) < 0.01) break;
        }
        const bruto = brutoHinnang;
        const tööandjaKogukulu = bruto * (1 + MAKSUD.SOTSIAALMAKS + tööandjaTöötuskindlustus);
        return { bruto, kogukulu: tööandjaKogukulu };
    }

    if (props.tüüp === "kogukulu") {
        const bruto = props.väärtus / (1 + MAKSUD.SOTSIAALMAKS + tööandjaTöötuskindlustus);
        const pension = bruto * pensioniMäär;
        const töötuskindlustus = bruto * töötajaTöötuskindlustus;
        const tulumaks = (bruto - pension - töötuskindlustus) * MAKSUD.TULUMAKS;
        const neto = bruto - pension - töötuskindlustus - tulumaks;
        return { bruto, neto };
    }

    return {};
};