import ApiService from './api';

const payments = {
  openRazorpayCheckout: (options) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        reject(response.error);
      });

      rzp.open();
      resolve(); // resolve immediately as Razorpay opens modal
    });
  },

  createPaymentOrder: async (paymentData) => {
    // paymentData contains amount, type, other info per backend API
    try {
      const response = await ApiService.post('/membership/payment/create/', paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  verifyPayment: async (verificationData) => {
    // verificationData contains razorpay_payment_id, signature, order_id, etc.
    try {
      const response = await ApiService.post('/membership/payment/verify/', verificationData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default payments;
