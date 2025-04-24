namespace Domain
{
    public class PalkSisend : PalkBase
    {
        public int PensioniProtsent { get; set; } = 2; // 2, 4, või 6
        public bool Töötuskindlustusmakse { get; set; } = true;
    }
}
