import React from 'react';

const TrafficAnalysis = () => {
  const cards = [
    {
      title: 'Know About AQI',
      description: 'The Air Quality Index (AQI) is a numerical scale used to measure and communicate the level of air pollution in a specific area.',
      img: 'https://images.pexels.com/photos/3680457/pexels-photo-3680457.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Find Out More',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Know The Pollution Around Your Locality',
      description: 'Air pollution levels vary across different areas based on traffic, industries, and natural factors. The Air Quality Index (AQI) helps track pollution levels in real-time, indicating the air',
      img: 'https://via.placeholder.com/400x300?text=Pollution+Info',
      buttonText: 'Find Out More',
      bgColor: 'bg-gray-900',
    },
  ];

  return (
    <section id='traffic' className="py-8 sm:py-12 lg:py-16 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Title and Subtitle */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-grotesk">
            Save the Time By using our traffic analysis
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 font-grotesk">
          Save time and avoid traffic jams with our AI-powered Traffic Analysis. By analyzing real-time data, congestion patterns, and alternate routes, we help you reach your destination faster and more efficiently. With live traffic updates, AI-driven route optimization, and smart predictions, you can plan your trips with ease while reducing fuel consumption and emissions. Experience a smoother, hassle-free journey with our intelligent traffic solutions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Image Card */}
          <div className="group rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/31339000/pexels-photo-31339000/free-photo-of-bustling-urban-street-scene-with-traffic.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Traffic Analysis"
                className="w-full h-[520px] sm:h-95 md:h-95 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white font-grotesk text-black px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base">
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-grotesk font-semibold mb-3 sm:mb-4">{card.title}</h3>
                  <p className="text-gray-200 mb-4 sm:mb-6 text-sm font-grotesk sm:text-base">{card.description}</p>
                </div>
                <button className="bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors w-fit text-sm sm:text-base">
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficAnalysis;