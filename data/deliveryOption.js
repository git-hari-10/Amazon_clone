export const deliveryOptions = [{
    id: '1',
    deliverydays: 7,
    priceCents: 0
}, {
    id: '2',
    deliverydays: 3,
    priceCents: 499
}, {
    id: '3',
    deliverydays: 1,
    priceCents: 999
}];

export function getDeliveryOption(deliveryOptionsId) {
    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionsId) {
            deliveryOption = option;
        }
    });

    return deliveryOption || deliveryOptions[0];
}