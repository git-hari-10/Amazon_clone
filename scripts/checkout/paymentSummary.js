import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from "../../data/deliveryOption.js";
import { formatCurrency } from "../utils/currency.js";
import { addOrders } from "../../data/orders.js";

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalPrice = totalBeforeTaxCents + taxCents;

    document.querySelector('.js-payment-summary')
        .innerHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cart.length}):</div>
            <div class="payment-summary-money">
                $${formatCurrency(productPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
                $${formatCurrency(shippingPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
                $${formatCurrency(totalBeforeTaxCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
                $${formatCurrency(taxCents)}
            </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
                $${formatCurrency(totalPrice)}
            </div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
        `;

    // ✅ Button click
    document.querySelector('.js-place-order').addEventListener("click", async () => {
        try {
            const response = await fetch('https://supersimplebackend.dev/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cart })
            });

            const order = await response.json();
            addOrders(order);

            // Clear cart
            localStorage.removeItem("cart");

            // ✅ Show animation before redirect
            showSuccessAnimation(() => {
                window.location.href = `tracking.html?orderId=${order.id}`;
            });

        } catch (error) {
            console.error("Unexpected error, try again later");
        }
    });

    function showSuccessAnimation(onFinish) {
        const overlay = document.createElement("div");
        overlay.classList.add("success-overlay");

        overlay.innerHTML = `
          <svg class="checkmark" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25"/>
              <path class="checkmark__check" d="M14 27l7 7 16-16"/>
          </svg>

          <div class="success-text">Order Placed Successfully!</div>
          <canvas id="confetti"></canvas>
        `;

        document.body.appendChild(overlay);

        // Start confetti
        startConfetti();

        // After 3 s -> fade out -> redirect
        setTimeout(() => {
            overlay.classList.add("fade-out");
            setTimeout(() => {
                overlay.remove();
                if (onFinish) onFinish();
            }, 600);
        }, 3000);
    }

    function startConfetti() {
        const canvas = document.getElementById("confetti");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const rect = document.querySelector(".checkmark").getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        const confetti = [];
        for (let i = 0; i < 120; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 7 + 5;
            confetti.push({
                x: originX,
                y: originY,
                w: Math.random() * 8 + 3,
                h: Math.random() * 14 + 5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: `hsl(${Math.random() * 360},100%,50%)`,
                gravity: 0.12,
                alpha: 1,
                bounce: 0.5
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confetti.forEach((c) => {
                ctx.globalAlpha = c.alpha;
                ctx.fillStyle = c.color;
                ctx.fillRect(c.x, c.y, c.w, c.h);
            });
        }

        function update() {
            confetti.forEach((c) => {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += c.gravity;

                if (c.y + c.h > canvas.height) {
                    c.y = canvas.height - c.h;
                    c.vy *= -c.bounce; // bounce upward
                }

                if (c.y < 0) {
                    c.y = 0;
                    c.vy *= -c.bounce;
                }

                if (c.x < 0) {
                    c.x = 0;
                    c.vx *= -c.bounce;
                }
                if (c.x + c.w > canvas.width) {
                    c.x = canvas.width - c.w;
                    c.vx *= -c.bounce;
                }

                // Slow fade after multiple bounce
                c.alpha -= 0.002;
            });
        }

        function loop() {
            draw();
            update();
            requestAnimationFrame(loop);
        }
        loop();
    }

}
