export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveCart() {
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
            quantity: selectedQuantity,
            deliveryOptionId: '1'
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

export function getCartQuantity() {
    let quantity = 0;
    cart.forEach((item) => {
        quantity += item.quantity;
    });
    return quantity;
}

export function updateDeliveryOptions(productId, deliveryOptionId) {
   let matchingItem;

   cart.forEach((cartItem) => {
       if (cartItem.productId === productId) {
           matchingItem = cartItem;
       }
   });
   matchingItem.deliveryOptionId = deliveryOptionId;
   saveCart();
}