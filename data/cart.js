export let cart =  [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 1
},{
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 2
}];

export function addToCart(productId) {
    const quantitySelector = document.querySelector(`.js-select-quantity[data-product-id="${productId}"]`);
    const selectedQuantity = Number(quantitySelector.value);

    let matchingItem = cart.find(item => item.id === productId);

    if (matchingItem) {

        matchingItem.quantity += selectedQuantity;
    } else {
        cart.push({
            id: productId,
            quantity: selectedQuantity
        });
    }
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;
}
