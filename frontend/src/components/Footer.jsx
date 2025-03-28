import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto flex justify-around flex-wrap gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <ul className="list-none">
            <li className="mb-2">Careers</li>
            <li className="mb-2">Contact Us</li>
            <li className="mb-2">Privacy Notice</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Section 1</h3>
          <ul className="list-none">
            <li className="mb-2">Add Property</li>
            <li className="mb-2">Customer Portal</li>
            <li className="mb-2">Community Voice</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Section 2</h3>
          <ul className="list-none">
            <li className="mb-2">East Village</li>
            <li className="mb-2">Hyde Park</li>
            <li className="mb-2">Downtown Dallas</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <p className="mb-2">(888) 123-4567</p>
          <p>123 Lincoln Street, Chicago, USA</p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center">
        
      </div>
    </footer>
  );
};

export default Footer;