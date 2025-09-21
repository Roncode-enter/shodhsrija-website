
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { MagnifyingGlassIcon, DocumentArrowDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const fetchPublications = async (searchQuery = '', category = '') => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);
  if (category) params.append('category', category);

  const response = await fetch(`/api/research/publications/?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch publications');
  return response.json();
};

const Research = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCitation, setShowCitation] = useState(null);
  const [citationFormat, setCitationFormat] = useState('apa');

  const { data: publications, isLoading, refetch } = useQuery(
    ['publications', searchQuery, selectedCategory], 
    () => fetchPublications(searchQuery, selectedCategory),
    { keepPreviousData: true }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const categories = [
    'All', 'Urban Issues', 'Environmental Issues', 'Digital Divide', 'Governance Issues', 'Social Issues'
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
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
        <title>Research & Knowledge Centre - ShodhSrija Foundation</title>
        <meta name="description" content="Access our research publications, papers, and knowledge resources. Search through our repository and Google Scholar integration." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Research & Knowledge Centre
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Explore our research publications, access scholarly resources, and discover evidence-based solutions to societal challenges
            </motion.p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search publications, papers, or browse Google Scholar..."
                    className="flex-1 px-4 py-3 pl-12 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-l-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-full font-semibold transition-colors"
                  >
                    Search
                  </button>
                </div>
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </form>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category === 'All' ? '' : category);
                      refetch();
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      (category === 'All' && !selectedCategory) || selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {publications && publications.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {publications.map((publication, index) => (
                  <motion.div
                    key={publication.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Publication Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                            {publication.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {publication.publication_type}
                            </span>
                            {publication.publication_date && (
                              <span>
                                {new Date(publication.publication_date).getFullYear()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Authors */}
                      {publication.authors && publication.authors.length > 0 && (
                        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                          {publication.authors.join(', ')}
                        </p>
                      )}

                      {/* Journal */}
                      {publication.journal_name && (
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          {publication.journal_name}
                        </p>
                      )}
                    </div>

                    {/* Abstract */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {publication.abstract}
                    </p>

                    {/* Tags */}
                    {publication.tags && publication.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {publication.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {publication.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                            +{publication.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {publication.pdf_url && (
                        <a
                          href={publication.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                          <span>Download PDF</span>
                        </a>
                      )}

                      {publication.external_url && (
                        <a
                          href={publication.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          View Online
                        </a>
                      )}

                      <button
                        onClick={() => setShowCitation(showCitation === publication.id ? null : publication.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Cite</span>
                      </button>
                    </div>

                    {/* Citation Modal */}
                    {showCitation === publication.id && (
                      <motion.div
                        className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Citation</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCitationFormat('apa')}
                              className={`px-2 py-1 text-xs rounded ${
                                citationFormat === 'apa'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              APA
                            </button>
                            <button
                              onClick={() => setCitationFormat('mla')}
                              className={`px-2 py-1 text-xs rounded ${
                                citationFormat === 'mla'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              MLA
                            </button>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                            {citationFormat === 'apa' ? publication.citation_apa : publication.citation_mla}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(citationFormat === 'apa' ? publication.citation_apa : publication.citation_mla)}
                          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                        >
                          Copy to Clipboard
                        </button>
                      </motion.div>
                    )}

                    {/* Download Count */}
                    {publication.download_count > 0 && (
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        Downloaded {publication.download_count} times
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No publications found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or browse all categories
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Contribute to Our Research
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Have research findings to share? Join our community of researchers and help build our knowledge base.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Submit Research
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Collaboration Guidelines
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Research;

