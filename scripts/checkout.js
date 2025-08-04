import { cart, removeFromCart, getCartQuantity, saveCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/Currency.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOption.js';

let cartSummary = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });

    cartSummary +=
    `
        <div class="cart-item-container
         js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <div class="cart-item-actions">
                      <button class="btn btn-yellow js-update-btn" data-product-id="${matchingProduct.id}">Update</button>
                      <input type="number" class="quantity-input hidden" />
                      <button class="btn btn-yellow save-quantity-link hidden" data-product-id="${matchingProduct.id}">Save</button>
                      <button class="btn btn-gray js-delete" data-product-id="${matchingProduct.id}">Delete</button>
                  </div>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
        </div>
    `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOptions) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOptions.deliverydays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        const priceString = deliveryOptions.priceCents === 0
            ? 'FREE'
            : `$${formatCurrency(deliveryOptions.priceCents)} -`;

        const isChecked = deliveryOptions.id === cartItem.deliveryOptionId;
        html += `
            <div class="delivery-option">
                <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                </div>
            </div>
        `;
    });
    return html;
}

document.querySelector('.js-checkout-items a')
    .textContent = `${getCartQuantity()} items`;

document.querySelector('.js-order-summary')
    .innerHTML = cartSummary;

document.querySelectorAll('.js-delete')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            const container = document.querySelector(
                `.js-cart-item-container-${productId}`);
            container.remove();

            document.querySelector('.js-checkout-items a')
                .textContent = `${getCartQuantity()} items`;
        });
    });

// Show input and save button when "Update" is clicked
document.querySelectorAll('.js-update-btn').forEach((updateBtn) => {
    updateBtn.addEventListener('click', () => {
        const container = updateBtn.closest('.cart-item-actions');
        const input = container.querySelector('.quantity-input');
        const saveBtn = container.querySelector('.save-quantity-link');

        input.classList.remove('hidden');
        saveBtn.classList.remove('hidden');
    });
});

document.querySelectorAll('.save-quantity-link').forEach((saveBtn) => {
    saveBtn.addEventListener('click', () => {
        const container = saveBtn.closest('.cart-item-actions');
        const input = container.querySelector('.quantity-input');
        const productId = saveBtn.dataset.productId;
        const newQuantity = parseInt(input.value);

        if (isNaN(newQuantity) || newQuantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }

        const matchingItem = cart.find(item => item.productId === productId);
        if (matchingItem) {
            matchingItem.quantity = newQuantity;
            saveCart();
        }

        const quantityLabel = document.querySelector(`.js-cart-item-container-${productId} .quantity-label`);
        quantityLabel.textContent = String(newQuantity);

        input.classList.add('hidden');
        saveBtn.classList.add('hidden');
        input.value = '';

        document.querySelector('.js-checkout-items a')
            .textContent = `${getCartQuantity()} items`;
    });
});
