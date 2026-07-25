export const getOrderConfirmationHtml = (order: any) => `
  <h1>Order Confirmation</h1>
  <p>Thank you for your order!</p>
  <p>Order ID: ${order._id}</p>
  <p>Total: ${(order.total / 100).toFixed(2)}</p>
  <p>Status: ${order.orderStatus}</p>
`;
