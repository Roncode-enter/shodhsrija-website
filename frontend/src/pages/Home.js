
import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Helmet } from 'react-helmet-async';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// API service
const fetchHomepageData = async () => {
  const response = await fetch('/api/core/homepage-data/');
  if (!response.ok) {
    throw new Error('Failed to fetch homepage data');
  }
  return response.json();
};

const Home = () => {
  const { data, isLoading, error } = useQuery('homepageData', fetchHomepageData);
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading homepage data</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>ShodhSrija Foundation - Youth Innovation for Societal Change</title>
        <meta name="description" content="A youth-driven research and innovation NGO focused on addressing societal challenges through research, innovation, and community engagement." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-4"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Youth Innovation for
              <br />
              <span className="text-yellow-400">Societal Change</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Empowering young minds to research, innovate, and create sustainable solutions 
              for India's most pressing challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Us
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Donate Now
              </motion.button>
            </div>
          </motion.div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </section>

        {/* Impact Stats Counter */}
        <section className="py-20 bg-white dark:bg-gray-900" ref={statsRef}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Making a difference across India, one project at a time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data?.stats && Object.entries(data.stats).map(([key, value]) => (
                <motion.div
                  key={key}
                  className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700"
                  variants={cardVariants}
                  initial="hidden"
                  animate={statsInView ? "visible" : "hidden"}
                >
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {statsInView && <CountUp end={value} duration={2} />}
                    {key === 'cities_impacted' && '+'}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive India Map */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Headquarters
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Based in New Delhi, working across India
              </p>
            </div>

            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[28.6139, 77.2090]} // New Delhi coordinates
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[28.6139, 77.2090]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">Our Headquarters</h3>
                      <p>ShodhSrija Foundation</p>
                      <p>New Delhi, India</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        {/* Focus Areas Grid */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Focus Areas
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Addressing India's most pressing challenges through research and innovation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.focus_areas?.map((area, index) => (
                <motion.div
                  key={area.id}
                  className="group cursor-pointer p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4"
                    style={{ backgroundColor: area.color }}
                  >
                    📊
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {area.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.subtopics?.slice(0, 3).map((subtopic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {subtopic}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stories Section */}
        {data?.featured_stories && data.featured_stories.length > 0 && (
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Impact Stories
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Real stories of change and innovation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.featured_stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    {story.image && (
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {story.summary}
                      </p>
                      {story.location && (
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          📍 {story.location}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Media Bar */}
        <section className="py-12 bg-blue-600">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-white mb-8">
              Follow Our Journey
            </h3>
            <div className="flex justify-center space-x-6">
              {[
                { name: 'Twitter', icon: '🐦', href: '#' },
                { name: 'LinkedIn', icon: '💼', href: '#' },
                { name: 'Facebook', icon: '📘', href: '#' },
                { name: 'Instagram', icon: '📸', href: '#' },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full text-white text-xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
