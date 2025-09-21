
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';

const fetchTeamData = async () => {
  const response = await fetch('/api/core/team/');
  if (!response.ok) throw new Error('Failed to fetch team data');
  return response.json();
};

const About = () => {
  const { data: teamMembers, isLoading } = useQuery('teamMembers', fetchTeamData);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        <title>About Us - ShodhSrija Foundation</title>
        <meta name="description" content="Learn about ShodhSrija Foundation's mission, vision, and the team working towards societal change through research and innovation." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About ShodhSrija Foundation
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Empowering youth to create sustainable solutions for India's challenges through research, innovation, and community engagement.
            </motion.p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                className="text-center lg:text-left"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  To foster a community of young researchers and innovators who are passionate about addressing 
                  societal challenges through evidence-based research, technological innovation, and sustainable 
                  community engagement. We aim to bridge the gap between academic research and real-world 
                  implementation to create lasting positive impact.
                </p>
              </motion.div>

              <motion.div
                className="text-center lg:text-left"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  To become India's leading youth-driven organization for social innovation, creating a generation 
                  of change-makers who use research and technology to solve complex societal problems. We envision 
                  a future where every young person has the opportunity to contribute meaningfully to society 
                  through their unique skills and perspectives.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Status */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Key Information
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { title: "Established", value: "2025", icon: "📅" },
                { title: "Status", value: "Registered Non-Profit", icon: "🏛️" },
                { title: "Focus Areas", value: "5 Major Sectors", icon: "🎯" },
                { title: "Approach", value: "Interdisciplinary", icon: "🔬" }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg"
                  variants={itemVariants}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Leadership Team
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Meet the passionate individuals leading our mission
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {teamMembers?.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center group hover:shadow-lg transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-4">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {member.bio_short}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        📧
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        💼
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        🐦
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Join Our Mission
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Be part of the change you want to see. Together, we can create sustainable solutions for a better tomorrow.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Become a Member
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Contact Us
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
