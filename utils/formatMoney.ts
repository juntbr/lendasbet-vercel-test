export default function formatMoney(value: number, currency = "BRL") {
    return (value ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 2,
    });
}