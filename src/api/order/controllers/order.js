"use strict";
const stripe = require("stripe")(
  "sk_test_51MwbYWDZhLa238hLqi6130ZQW1AW1TYNb82ZbNqRdXfmKYr9FoznhMgZGctEIueXNx2AilubDkFKmhR0FcN5gpYW00ByMOusD1"
);
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, userName, email } = ctx.request.body;
    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const item = await strapi
            .service("api::item.item")
            .findOne(product.id);
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: product.quantity,
          };
        })
      );
      //create stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        mode: "payment",
        // success_url: `${process.env.FRONTEND_URL}/checkout/success/{CHECKOUT_SESSION_ID}`,
        success_url: `${process.env.BACKEND_URL}/api/orders/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        line_items: lineItems,
      });

      //create strapi order
      await strapi.service("api::order.order").create({
        data: { userName, products, stripeSessionId: session.id, paid: false },
      });

      return { id: session.id };
    } catch (error) {
      ctx.response.status = 500;
      console.log(error);
      return { error: error.message };
    }
  },
  /**
   * Handle successful payment
   */
  async handleSuccessfulPayment(ctx) {
    try {
      const { sessionId } = ctx.params;
      // Retrieve the Stripe session by ID to confirm the payment
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      // Check if the payment was successful
      if (stripeSession.payment_status === "paid") {
        // Do something here to fulfill the order, e.g. create a new order in your database
        // ...
        // Return a success message to the user
        const order = await strapi
          .query("api::order.order")
          .findOne({ stripeSessionId: sessionId });
        if (!order) {
          return { message: "Order not found." };
        }
        const updatedOrder = await strapi.entityService.update(
          "api::order.order",
          order.id,
          { data: { paid: true } }
        );
        return updatedOrder.products;
      } else {
        // Handle other payment statuses, e.g. "unpaid", "canceled"
        return { message: "Payment unsuccessful." };
      }
    } catch (error) {
      // Handle errors
      console.error(error);
      ctx.response.status = 500;
      return { error: error.message };
    }
  },
}));
