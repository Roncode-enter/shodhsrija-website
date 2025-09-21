
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

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

// API functions
const fetchMembershipTiers = async () => {
  const response = await fetch('/api/membership/tiers/');
  if (!response.ok) throw new Error('Failed to fetch membership tiers');
  return response.json();
};

const submitMembershipApplication = async (data) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/membership/apply/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit application');
  return response.json();
};

const createPaymentOrder = async (data) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/membership/payment/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create payment order');
  return response.json();
};

const verifyPayment = async (data) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/membership/payment/verify/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to verify payment');
  return response.json();
};

const Membership = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('2');
  const [showApplication, setShowApplication] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const { data: tiers, isLoading } = useQuery('membershipTiers', fetchMembershipTiers);

  const applicationMutation = useMutation(submitMembershipApplication, {
    onSuccess: async (data) => {
      toast.success('Application submitted successfully!');

      // If tier is not free, proceed to payment
      if (selectedTier && !selectedTier.is_free) {
        await handlePayment(data.application_id);
      } else {
        reset();
        setShowApplication(false);
        setSelectedTier(null);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  const handlePayment = async (applicationId) => {
    try {
      // Load Razorpay
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Calculate amount
      const amount = selectedDuration === '2' 
        ? selectedTier.price_2_months 
        : selectedTier.price_4_months;

      // Create payment order
      const orderData = await createPaymentOrder({
        payment_type: 'membership',
        amount: amount,
        application_id: applicationId,
      });

      // Configure Razorpay options
      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount * 100, // Amount in paise
        currency: orderData.currency,
        name: 'ShodhSrija Foundation',
        description: `${selectedTier.display_name} Membership - ${selectedDuration} months`,
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await verifyPayment({
              payment_id: orderData.payment_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success('Payment successful! Your membership has been activated.');
            reset();
            setShowApplication(false);
            setSelectedTier(null);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: watch('full_name'),
          email: watch('user_email') || '',
          contact: watch('phone'),
        },
        theme: {
          color: '#2563eb',
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Payment initiation failed');
    }
  };

  const onSubmit = (data) => {
    applicationMutation.mutate({
      ...data,
      membership_tier_id: selectedTier.id,
      duration_months: selectedDuration,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Membership - ShodhSrija Foundation</title>
        <meta name="description" content="Join ShodhSrija Foundation and become part of our mission to create societal change through research and innovation." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Become a member of ShodhSrija Foundation and contribute to creating positive 
              societal change through research, innovation, and community engagement.
            </p>
          </div>

          {!showApplication ? (
            <>
              {/* Membership Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {tiers?.map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedTier?.id === tier.id
                        ? 'border-blue-500 ring-4 ring-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedTier(tier)}
                  >
                    {/* Popular badge for Researcher tier */}
                    {tier.name === 'researcher' && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                        Popular
                      </div>
                    )}

                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {tier.display_name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {tier.description}
                        </p>

                        {tier.is_free ? (
                          <div className="text-3xl font-bold text-green-500">
                            FREE
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                              ₹{tier.price_2_months}
                              <span className="text-sm font-normal text-gray-500">
                                /2 months
                              </span>
                            </div>
                            <div className="text-lg text-gray-600 dark:text-gray-400">
                              ₹{tier.price_4_months} for 4 months
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        {tier.benefits?.map((benefit, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedTier?.id === tier.id && (
                      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Duration Selection */}
              {selectedTier && !selectedTier.is_free && (
                <motion.div
                  className="max-w-md mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Choose Duration
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedDuration('2')}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedDuration === '2'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        2 Months
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{selectedTier.price_2_months}
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedDuration('4')}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedDuration === '4'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        4 Months
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{selectedTier.price_4_months}
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Proceed Button */}
              {selectedTier && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => setShowApplication(true)}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
                  >
                    Proceed to Application
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            /* Application Form */
            <motion.div
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Membership Application
                </h2>
                <button
                  onClick={() => {
                    setShowApplication(false);
                    setSelectedTier(null);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('full_name', { required: 'Full name is required' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address', { required: 'Address is required' })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      {...register('state', { required: 'State is required' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      {...register('postal_code')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* ID Proof */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Proof Type *
                    </label>
                    <select
                      {...register('id_proof_type', { required: 'ID proof type is required' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select ID Type</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="voter_id">Voter ID</option>
                      <option value="student_id">Student ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      {...register('id_proof_number', { required: 'ID number is required' })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Why do you want to join ShodhSrija Foundation? *
                  </label>
                  <textarea
                    {...register('motivation', { required: 'This field is required' })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about your motivation and how you can contribute..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowApplication(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applicationMutation.isLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
                  >
                    {applicationMutation.isLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Membership;
