import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";

async function initCheckout() {
    try {
        await loadProductsFetch();
    }
    catch (error) {
        console.log('Please try again later.');
    }
    renderOrderSummary();
    renderPaymentSummary();
}
initCheckout().catch(err => console.error(err));


