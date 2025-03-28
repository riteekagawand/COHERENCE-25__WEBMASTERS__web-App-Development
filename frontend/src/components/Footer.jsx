import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 font-grotesk">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-around flex-wrap gap-6 sm:gap-8">
        {/* About Us */}
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">About Us</h3>
          <ul className="list-none text-sm sm:text-base">
            <li className="mb-2">Careers</li>
            <li className="mb-2">Contact Us</li>
            <li className="mb-2">Privacy Notice</li>
          </ul>
        </div>

        {/* Section 1 */}
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Section 1</h3>
          <ul className="list-none text-sm sm:text-base">
            <li className="mb-2">Add Property</li>
            <li className="mb-2">Customer Portal</li>
            <li className="mb-2">Community Voice</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Section 2</h3>
          <ul className="list-none text-sm sm:text-base">
            <li className="mb-2">East Village</li>
            <li className="mb-2">Hyde Park</li>
            <li className="mb-2">Downtown Dallas</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
          <p className="mb-2 text-sm sm:text-base">(+91) 987656789</p>
          <p className="text-sm sm:text-base">123 Street, Mumbai, Maharashtra</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Your Company Name. All rights reserved to SmartGrid.
        </p>
      </div>
    </footer>
  );
};

export default Footer;