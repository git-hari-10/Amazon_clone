import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";

async function initCheckout() {
    await loadProductsFetch();
    renderOrderSummary();
    renderPaymentSummary();
}
initCheckout().catch(err => console.error(err));


