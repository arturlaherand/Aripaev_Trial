using Domain;

namespace BusinessLogic
{
    public class PalkService
    {
        public PalkTulemus Calculate(PalkSisend sisend)
        {
            decimal pensioniMäär = sisend.PensioniProtsent / 100m;
            decimal töötajaTöötusKindlustus = sisend.Töötuskindlustusmakse ? 0.016m : 0m;
            decimal tööandjaTöötusKindlustus = sisend.Töötuskindlustusmakse ? 0.008m : 0m;
            decimal tulumaksuMäär = 0.20m;
            decimal sotsiaalmaksuMäär = 0.33m;

            if (sisend.BrutoPalk.HasValue)
            {
                var bruto = sisend.BrutoPalk.Value;
                var pension = bruto * pensioniMäär;
                var töötuskindlustus = bruto * töötajaTöötusKindlustus;
                var maksustatav = bruto - pension - töötuskindlustus;
                var tulumaks = maksustatav * tulumaksuMäär;
                var neto = bruto - pension - töötuskindlustus - tulumaks;
                var employerTaxes = bruto * (sotsiaalmaksuMäär + tööandjaTöötusKindlustus);
                var totalTööandjaKulu = bruto + employerTaxes;

                return new PalkTulemus
                {
                    NetoPalk = Math.Round(neto, 2),
                    BrutoPalk = Math.Round(bruto, 2),
                    TööandjaKulu = Math.Round(totalTööandjaKulu, 2)
                };
            }

            if (sisend.NetoPalk.HasValue)
            {
                // Maksude vahelise ringsõltuvuse tõttu vajab ligikaudset lahendust.
                decimal neto = sisend.NetoPalk.Value;
                decimal brutoHinnang = neto / 0.75m;
                for (int i = 0; i < 10; i++)
                {
                    var pension = brutoHinnang * pensioniMäär;
                    var töötuskindlustus = brutoHinnang * töötajaTöötusKindlustus;
                    var maksustatav = brutoHinnang - pension - töötuskindlustus;
                    var tulumaks = maksustatav * tulumaksuMäär;
                    var calculatedNet = brutoHinnang - pension - töötuskindlustus - tulumaks;

                    var error = neto - calculatedNet;
                    brutoHinnang += error;
                    if (Math.Abs(error) < 0.01m) break;
                }

                var finalbruto = brutoHinnang;
                var tööandjaMaksud = finalbruto * (sotsiaalmaksuMäär + tööandjaTöötusKindlustus);
                var tööandjaKulu = finalbruto + tööandjaMaksud;

                return new PalkTulemus
                {
                    NetoPalk = Math.Round(neto, 2),
                    BrutoPalk = Math.Round(finalbruto, 2),
                    TööandjaKulu = Math.Round(tööandjaKulu, 2)
                };
            }

            if (sisend.TööandjaKulu.HasValue)
            {
                var tööandjaKulu = sisend.TööandjaKulu.Value;
                var bruto = tööandjaKulu / (1 + sotsiaalmaksuMäär + tööandjaTöötusKindlustus);
                var pension = bruto * pensioniMäär;
                var töötuskindlustus = bruto * töötajaTöötusKindlustus;
                var maksustatav = bruto - pension - töötuskindlustus;
                var tulumaks = maksustatav * tulumaksuMäär;
                var neto = bruto - pension - töötuskindlustus - tulumaks;

                return new PalkTulemus
                {
                    NetoPalk = Math.Round(neto, 2),
                    BrutoPalk = Math.Round(bruto, 2),
                    TööandjaKulu = Math.Round(tööandjaKulu, 2)
                };
            }

            throw new ArgumentException("Netopalk, brutopalk või tööandjakogukulu peavad olema täidetud!");
        }
    }
}
