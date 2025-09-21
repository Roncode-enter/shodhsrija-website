
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';

const submitContactForm = async (data) => {
  const response = await fetch('/api/core/contact/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit contact form');
  return response.json();
};

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const contactMutation = useMutation(submitContactForm, {
    onSuccess: () => {
      toast.success('Thank you for your message! We will get back to you soon.');
      reset();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });

  const onSubmit = (data) => {
    contactMutation.mutate(data);
  };

  const contactInfo = {
    address: "ShodhSrija Foundation, New Delhi, India",
    emails: [
      { label: "General Inquiries", email: "info@shodhsrija.org" },
      { label: "Grievances", email: "grievance@shodhsrija.org" },
      { label: "Volunteers", email: "volunteers@shodhsrija.org" }
    ],
    hours: "Monday - Friday: 9:00 AM - 6:00 PM IST"
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - ShodhSrija Foundation</title>
        <meta name="description" content="Get in touch with ShodhSrija Foundation. Contact us for inquiries, partnerships, volunteering opportunities, or general information." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Contact Us
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Have questions about our work, want to collaborate, or interested in volunteering? 
                    We're here to help and would love to hear from you.
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPinIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">{contactInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                      <div className="space-y-1">
                        {contactInfo.emails.map((item, index) => (
                          <div key={index}>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}:</span>
                            <a 
                              href={`mailto:${item.email}`}
                              className="block text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {item.email}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Office Hours</h3>
                      <p className="text-gray-600 dark:text-gray-400">{contactInfo.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {[
                      { name: 'Twitter', icon: '🐦', href: '#' },
                      { name: 'LinkedIn', icon: '💼', href: '#' },
                      { name: 'Facebook', icon: '📘', href: '#' },
                      { name: 'Instagram', icon: '📸', href: '#' },
                    ].map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full text-xl transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      {...register('subject', { required: 'Please select a subject' })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="media">Media Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows="6"
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isLoading}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
                  >
                    {contactMutation.isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Visit Our Office
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Located in the heart of New Delhi
              </p>
            </div>

            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[28.6139, 77.2090]} // New Delhi coordinates
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[28.6139, 77.2090]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">ShodhSrija Foundation</h3>
                      <p>New Delhi, India</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Our headquarters and main office
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
