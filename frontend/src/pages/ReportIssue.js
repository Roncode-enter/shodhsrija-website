
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { CameraIcon, MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const fetchIssueCategories = async () => {
  const response = await fetch('/api/issues/categories/');
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

const submitIssueReport = async (data) => {
  const response = await fetch('/api/issues/report/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit issue report');
  return response.json();
};

// Map component for location picking
const LocationPicker = ({ onLocationSelect, selectedLocation }) => {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        onLocationSelect({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[28.6139, 77.2090]} // New Delhi
      zoom={10}
      style={{ height: '300px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents />
      {selectedLocation && (
        <Marker position={[selectedLocation.latitude, selectedLocation.longitude]} />
      )}
    </MapContainer>
  );
};

const ReportIssue = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { data: categories } = useQuery('issueCategories', fetchIssueCategories);

  const reportMutation = useMutation(submitIssueReport, {
    onSuccess: (data) => {
      toast.success(`Issue reported successfully! Reference: ${data.issue_number}`);
      reset();
      setSelectedLocation(null);
      setUploadedImages([]);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit issue report');
    },
  });

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    // In a real implementation, you would upload to Cloudinary here
    // For now, we'll just store the file objects
    setUploadedImages(prev => [...prev, ...fileArray]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const reportData = {
      ...data,
      latitude: selectedLocation?.latitude,
      longitude: selectedLocation?.longitude,
      images: uploadedImages.map(img => img.name), // In real app, these would be Cloudinary URLs
      is_anonymous: isAnonymous,
    };

    reportMutation.mutate(reportData);
  };

  return (
    <>
      <Helmet>
        <title>Report an Issue - ShodhSrija Foundation</title>
        <meta name="description" content="Report societal or environmental issues in your community. Help us identify and address problems that need attention." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ExclamationTriangleIcon className="w-20 h-20 mx-auto text-yellow-300" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Report an Issue
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Help us identify and address societal or environmental issues in your community. 
              Your report can spark meaningful change.
            </motion.p>
          </div>
        </section>

        {/* Report Form */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Issue Category */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Issue Category *
                  </label>
                  <select
                    {...register('category_id', { required: 'Please select a category' })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select an issue category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-2 text-sm text-red-500">{errors.category_id.message}</p>
                  )}
                </div>

                {/* Issue Title */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Issue title is required' })}
                    placeholder="Brief title describing the issue"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                {/* Issue Description */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Detailed Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Issue description is required' })}
                    rows="6"
                    placeholder="Describe the issue in detail. Include what you observed, when it occurs, who is affected, and any other relevant information."
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                    Location Information *
                  </label>

                  <div>
                    <input
                      type="text"
                      {...register('location_description', { required: 'Location description is required' })}
                      placeholder="Describe the location (e.g., Near City Mall, Main Road intersection)"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {errors.location_description && (
                      <p className="mt-2 text-sm text-red-500">{errors.location_description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="City"
                      className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      {...register('state')}
                      placeholder="State"
                      className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Map for Location Picking */}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Click on the map to mark the exact location (optional)
                    </p>
                    <LocationPicker
                      onLocationSelect={setSelectedLocation}
                      selectedLocation={selectedLocation}
                    />
                    {selectedLocation && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        ✓ Location marked: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Upload Images (Optional)
                  </label>
                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    >
                      <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click to upload images that show the issue
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Supports JPG, PNG, GIF up to 10MB each
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />

                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reporter Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="anonymous" className="text-gray-700 dark:text-gray-300">
                      Report anonymously
                    </label>
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          {...register('reporter_name')}
                          placeholder="Your name (optional)"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          {...register('reporter_email')}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...register('reporter_phone')}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Important Notice
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        Please ensure all information provided is accurate and truthful. False reports may have legal consequences.
                        We will review your report and take appropriate action based on our assessment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={reportMutation.isLoading}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-full font-semibold text-lg transition-colors"
                  >
                    {reportMutation.isLoading ? 'Submitting Report...' : 'Submit Issue Report'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How Issue Reporting Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Report',
                  description: 'Fill out the form with detailed information about the issue',
                  icon: '📝'
                },
                {
                  step: '2', 
                  title: 'Review',
                  description: 'Our team reviews and verifies the submitted report',
                  icon: '🔍'
                },
                {
                  step: '3',
                  title: 'Action',
                  description: 'We work with relevant authorities and stakeholders',
                  icon: '⚡'
                },
                {
                  step: '4',
                  title: 'Update',
                  description: 'You receive updates on the progress and resolution',
                  icon: '📧'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ReportIssue;
