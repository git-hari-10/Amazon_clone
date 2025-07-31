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
        $${(product.priceCents / 100).toFixed(2)}
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

document.querySelector('.js-products-grid').innerHTML = productsHTML;

document.querySelectorAll('.js-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;

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

        console.log(cart);
    });
});
