
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', href: '/' },
      { name: 'About Us', href: '/about' },
      { name: 'Departments', href: '/departments' },
      { name: 'Research Centre', href: '/research' },
    ],
    'Get Involved': [
      { name: 'Membership', href: '/membership' },
      { name: 'Volunteer', href: '/membership' },
      { name: 'Donate', href: '/donate' },
      { name: 'Report Issue', href: '/report-issue' },
    ],
    'Resources': [
      { name: 'Publications', href: '/research' },
      { name: 'Impact Stories', href: '/#impact-stories' },
      { name: 'News & Updates', href: '/news' },
      { name: 'FAQ', href: '/faq' },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Instagram', icon: '📸', href: '#' },
  ];

  const contactEmails = [
    'info@shodhsrija.org',
    'grievance@shodhsrija.org',
    'volunteers@shodhsrija.org'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">ShodhSrija Foundation</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering youth to create sustainable solutions for India's challenges through 
              research, innovation, and community engagement.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <p className="text-gray-400">
                <span className="font-semibold">Address:</span> New Delhi, India
              </p>
              <div className="text-gray-400">
                <p className="font-semibold mb-1">Email:</p>
                {contactEmails.map((email, index) => (
                  <a
                    key={index}
                    href={`mailto:${email}`}
                    className="block text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full text-lg transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to our newsletter for the latest updates and impact stories.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
            <p>© {currentYear} ShodhSrija Foundation. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span>Registered NGO</span>
              <span>•</span>
              <span>80G & 12A Certified</span>
              <span>•</span>
              <span>Darpan ID Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
