import { cart, removeFromCart, getCartQuantity, saveCart, updateDeliveryOptions } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/currency.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from "./paymentSummary.js";


export function renderOrderSummary() {

    let cartSummary = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const selectedOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionId);
        const estimatedDate = dayjs().add(selectedOption.deliverydays, 'days').format('dddd, MMMM D');

        cartSummary += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date js-delivery-date-${matchingProduct.id}">
            Delivery date: ${estimatedDate}
          </div>
    
          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">
    
            <div class="cart-item-details">
              <div class="product-name">${matchingProduct.name}</div>
              <div class="product-price">${matchingProduct.getPrice()}</div>
              <div class="product-quantity">
                <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                <div class="cart-item-actions">
                  <button class="btn btn-yellow js-update-btn" data-product-id="${matchingProduct.id}">Update</button>
                  <input type="number" class="quantity-input hidden" />
                  <button class="btn btn-yellow save-quantity-link hidden" data-product-id="${matchingProduct.id}">Save</button>
                  <button class="btn btn-gray js-delete" data-product-id="${matchingProduct.id}">Delete</button>
                </div>
              </div>
            </div>
    
            <div class="delivery-options">
              <div class="delivery-options-title">Choose a delivery option:</div>
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
      `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';

        deliveryOptions.forEach((option) => {
            const today = dayjs();
            const deliveryDate = today.add(option.deliverydays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = option.priceCents === 0
                ? 'FREE'
                : `$${formatCurrency(option.priceCents)} -`;

            const isChecked = option.id === cartItem.deliveryOptionId;
            html += `
              <label class="delivery-option js-delivery-option"
                data-product-id="${matchingProduct.id}"
                data-delivery-options-id="${option.id}">
                <input type="radio" 
                  ${isChecked ? 'checked' : ''}
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <span>
                  <span class="delivery-option-date">${dateString}</span>
                  <span class="delivery-option-price">${priceString} Shipping</span>
                </span>
              </label>
            `;
        });

        return html;
    }

    // Render cart summary
    document.querySelector('.js-order-summary').innerHTML = cartSummary;

    // Update item count at top
    document.querySelector('.js-checkout-items a').textContent = `${getCartQuantity()} items`;

    // Delete item
    document.querySelectorAll('.js-delete').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            renderPaymentSummary();

            document.querySelector('.js-checkout-items a').textContent = `${getCartQuantity()} items`;
        });
    });

    // Show input/save on update
    document.querySelectorAll('.js-update-btn').forEach((updateBtn) => {
        updateBtn.addEventListener('click', () => {
            const container = updateBtn.closest('.cart-item-actions');
            const input = container.querySelector('.quantity-input');
            const saveBtn = container.querySelector('.save-quantity-link');

            input.classList.remove('hidden');
            saveBtn.classList.remove('hidden');
        });
    });

    // Save new quantity
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
            renderPaymentSummary();

            const quantityLabel = document.querySelector(`.js-cart-item-container-${productId} .quantity-label`);
            quantityLabel.textContent = String(newQuantity);

            input.classList.add('hidden');
            saveBtn.classList.add('hidden');
            input.value = '';

            document.querySelector('.js-checkout-items a').textContent = `${getCartQuantity()} items`;
        });
    });

    // Handle delivery option click
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const productId = element.dataset.productId;
            const deliveryOptionId = element.dataset.deliveryOptionsId;

            updateDeliveryOptions(productId, deliveryOptionId);

            const selectedOption = deliveryOptions.find(option => option.id === deliveryOptionId);
            if (!selectedOption) return;

            const newDate = dayjs().add(selectedOption.deliverydays, 'days').format('dddd, MMMM D');
            const dateElement = document.querySelector(`.js-delivery-date-${productId}`);
            if (dateElement) {
                dateElement.textContent = `Delivery date: ${newDate}`;
            }
            renderPaymentSummary();
        });
    });
}

