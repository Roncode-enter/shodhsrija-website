
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const fetchDepartments = async () => {
  const response = await fetch('/api/core/departments/');
  if (!response.ok) throw new Error('Failed to fetch departments');
  return response.json();
};

const Departments = () => {
  const [expandedDept, setExpandedDept] = useState(null);
  const { data: departments, isLoading } = useQuery('departments', fetchDepartments);

  const toggleDepartment = (deptId) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
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
        <title>Departments - ShodhSrija Foundation</title>
        <meta name="description" content="Explore our organizational departments and their roles in driving research, innovation, and social change." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-blue-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Our Departments
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Organized excellence across specialized teams working together to create meaningful change
            </motion.p>
          </div>
        </section>

        {/* Departments List */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {departments?.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Department Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => toggleDepartment(dept.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">
                          {dept.icon === 'business' && '🏢'}
                          {dept.icon === 'science' && '🔬'}
                          {dept.icon === 'research' && '📊'}
                          {dept.icon === 'people' && '👥'}
                          {dept.icon === 'school' && '🎓'}
                          {dept.icon === 'computer' && '💻'}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {dept.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {dept.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        {expandedDept === dept.id ? (
                          <ChevronUpIcon className="w-6 h-6" />
                        ) : (
                          <ChevronDownIcon className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedDept === dept.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-6 space-y-6">
                          {/* Department Head */}
                          {dept.head && (
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div>
                                {dept.head.photo ? (
                                  <img
                                    src={dept.head.photo}
                                    alt={dept.head.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                                    {dept.head.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Department Head
                                </h4>
                                <p className="text-lg text-blue-600 dark:text-blue-400">
                                  {dept.head.name}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Responsibilities */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Key Responsibilities
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {dept.responsibilities}
                            </p>
                          </div>

                          {/* Workflow Steps */}
                          {dept.workflow_steps && dept.workflow_steps.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Workflow Process
                              </h4>
                              <div className="space-y-3">
                                {dept.workflow_steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 pt-1">
                                      {step}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Team Structure */}
                          {dept.team_structure && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Team Structure
                              </h4>
                              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {dept.team_structure}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Contact Button */}
                          <div className="pt-4">
                            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                              Contact Department
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Join Our Team Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Join Our Team
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              We're always looking for passionate individuals to join our departments. 
              Be part of something meaningful and make a difference.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors">
                Apply Now
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full font-semibold transition-colors">
                Learn More
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Departments;
