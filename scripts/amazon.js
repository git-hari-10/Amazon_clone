import { products } from  '../data/products.js'
import { cart, addToCart } from '../data/cart.js'
import { formatCurrency } from "./utils/Currency.js";

let productsHTML = '';

products.forEach((product) => {
    productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}" alt="">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <label>
          <select class="js-select-quantity" data-product-id="${product.id}">
            ${[...Array(10)].map((_, i) =>
        `<option value="${i+1}" ${i === 0 ? 'selected' : ''}>${i+1}</option>`).join('')}
          </select>
        </label>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png" alt="">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-cart-button"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

export function updateCart() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    //To show in our landing page
    document.querySelector('.js-cart-no')
        .innerHTML = cartQuantity;
}

function buttonInteractive(button) {
    //show Added when click Add-to-cart btn
    const addMsg = button.parentElement.querySelector('.added-to-cart');
    addMsg.classList.add('visible');

    //Hide Added
    setTimeout(() => {
        addMsg.classList.remove('visible');
    },2000);
}

document.querySelector('.js-products-grid').innerHTML = productsHTML;
document.querySelectorAll('.js-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

        addToCart(productId);
        updateCart();
        buttonInteractive(button);

        console.log(cart);
    });
});

updateCart();