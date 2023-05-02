module.exports = {
  routes: [
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/orders/success/:sessionId',
      handler: 'order.handleSuccessfulPayment',
      config: {
        auth: false,
      },
    },
  ]
}