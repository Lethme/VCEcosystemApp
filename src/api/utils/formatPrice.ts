export const formatPrice = (price: number): string => {
    return Intl.NumberFormat("ru", {
        style: "currency",
        currency: "RUB",
    }).format(price);
}