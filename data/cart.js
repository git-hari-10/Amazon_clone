export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    const quantitySelector = document.querySelector(
        `.js-select-quantity[data-product-id="${productId}"]`
    );
    const selectedQuantity = Number(quantitySelector.value);

    const matchingItem = cart.find(item => item.productId === productId);

    if (matchingItem) {
        matchingItem.quantity += selectedQuantity;
    } else {
        cart.push({
            productId,
            quantity: selectedQuantity
        });
    }

    saveCart();
}

export function removeFromCart(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart();
    }
}
