
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { HeartIcon, ShieldCheckIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';

// Load Razorpay
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const createDonationOrder = async (data) => {
  const response = await fetch('/api/donations/create-order/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create donation order');
  return response.json();
};

const verifyDonationPayment = async (data) => {
  const response = await fetch('/api/donations/verify-payment/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to verify payment');
  return response.json();
};

const Donations = () => {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one_time');
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const donationMutation = useMutation(createDonationOrder, {
    onSuccess: async (data) => {
      await handlePayment(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to process donation');
    },
  });

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const getCurrentAmount = () => {
    return customAmount ? parseInt(customAmount) : selectedAmount;
  };

  const handlePayment = async (orderData) => {
    try {
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'ShodhSrija Foundation',
        description: 'Donation for Social Change',
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            await verifyDonationPayment({
              payment_id: orderData.payment_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success('Thank you for your donation! Receipt has been sent to your email.');
            reset();
            setShowForm(false);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#10b981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Payment initiation failed');
    }
  };

  const onSubmit = (data) => {
    const donationData = {
      ...data,
      amount: getCurrentAmount(),
      donation_type: donationType,
    };

    // Store donor data in session for payment verification
    sessionStorage.setItem('donation_data', JSON.stringify(donationData));

    donationMutation.mutate({
      payment_type: 'donation',
      amount: getCurrentAmount(),
    });
  };

  return (
    <>
      <Helmet>
        <title>Donate - ShodhSrija Foundation</title>
        <meta name="description" content="Support our mission to create positive social change. Your donation helps fund research, innovation, and community programs." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <HeartIcon className="w-20 h-20 mx-auto text-red-300" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Support Our Mission
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your donation powers research, innovation, and community programs that create lasting positive change across India
            </motion.p>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Impact
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                See how your donation creates real change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  amount: '₹500',
                  impact: 'Provides research materials for one rural innovation project',
                  icon: '🔬'
                },
                {
                  amount: '₹1,500',
                  impact: 'Sponsors a youth researcher for one month of fieldwork',
                  icon: '👨‍🎓'
                },
                {
                  amount: '₹5,000',
                  impact: 'Funds a complete community problem assessment study',
                  icon: '🏘️'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-900/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {item.amount}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.impact}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Make a Donation
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your contribution amount and help us create positive change
                </p>
              </div>

              {!showForm ? (
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Donation Type */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Donation Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'one_time', label: 'One-time', desc: 'Single donation' },
                        { id: 'monthly', label: 'Monthly', desc: 'Recurring monthly' },
                        { id: 'yearly', label: 'Yearly', desc: 'Recurring yearly' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setDonationType(type.id)}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            donationType === type.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {type.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {type.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Choose Amount
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-4 rounded-lg border-2 text-center font-semibold transition-all ${
                            selectedAmount === amount
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          ₹{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Current Amount Display */}
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Your {donationType.replace('_', '-')} donation
                    </div>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                      ₹{getCurrentAmount().toLocaleString()}
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowForm(true)}
                      disabled={getCurrentAmount() < 1}
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-full font-semibold text-lg transition-colors"
                    >
                      Proceed to Donate
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Donor Information Form */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          {...register('name', { required: 'Name is required' })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('email', { required: 'Email is required' })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PAN Number (for 80G Certificate)
                        </label>
                        <input
                          type="text"
                          {...register('pan_number')}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="ABCDE1234F"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register('wants_80g_certificate')}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          I want to receive 80G tax exemption certificate
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Purpose (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('purpose')}
                        placeholder="e.g., Education, Research, Community Development"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        {...register('message')}
                        rows="3"
                        placeholder="Share your thoughts or why you're supporting our cause..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={donationMutation.isLoading}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
                      >
                        {donationMutation.isLoading ? 'Processing...' : `Donate ₹${getCurrentAmount().toLocaleString()}`}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Tax Benefits Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tax Benefits & Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ShieldCheckIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  80G Certified
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get 50% tax deduction on your donations under Section 80G of Income Tax Act
                </p>
              </motion.div>

              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <DocumentCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  12A Registered
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Registered under Section 12A ensuring transparency and proper fund utilization
                </p>
              </motion.div>

              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl font-bold mx-auto mb-4">
                  NGO
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Darpan ID
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Registered with NGO Darpan portal for government recognition and transparency
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Donations;
