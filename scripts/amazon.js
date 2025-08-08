import { products, loadProducts } from '../data/products.js'
import { cart, addToCart } from '../data/cart.js'

export function updateCart() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-cart-no').innerHTML = cartQuantity;
}

loadProducts(() => {
    renderProductGrid();
    updateCart();
});

export function renderProductGrid() {
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
                <img class="product-rating-stars" src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                  ${product.rating.count}
                </div>
              </div>
        
              <div class="product-price">
                ${product.getPrice()}
              </div>
        
              <div class="product-quantity-container">
                <label>
                  <select class="js-select-quantity" data-product-id="${product.id}">
                    ${[...Array(10)].map((_, i) =>
            `<option value="${i + 1}" ${i === 0 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                  </select>
                </label>
              </div>
              
              ${product.extraInfoHTML()}
        
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

    function buttonInteractive(button) {
        const addMsg = button.parentElement.querySelector('.added-to-cart');
        addMsg.classList.add('visible');

        setTimeout(() => {
            addMsg.classList.remove('visible');
        }, 2000);
    }

    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    document.querySelectorAll('.js-cart-button').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
            updateCart();
            buttonInteractive(button);
        });
    });

    // Refresh on back/forward
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            location.reload();
        } else {
            updateCart();
        }
    });
}
