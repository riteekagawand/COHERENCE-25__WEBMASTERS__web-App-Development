import React from 'react';

const TrafficAnalysis = () => {
  const cards = [
    {
      title: 'Know About AQI',
      description: 'Give the reason of the above',
      img: 'https://via.placeholder.com/400x300?text=AQI+Info',
      buttonText: 'Find Out More',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Know The Pollution Around Your Locality',
      description: 'Reason of the above statement',
      img: 'https://via.placeholder.com/400x300?text=Pollution+Info',
      buttonText: 'Find Out More',
      bgColor: 'bg-gray-900',
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Title and Subtitle */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Save the Time By using our traffic analysis
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Give the reason of the above
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Card */}
          <div className="group rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
              <img
                src="https://via.placeholder.com/600x400?text=Traffic+Analysis"
                alt="Traffic Analysis"
                className="w-full h-64 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} text-white rounded-2xl p-8 flex flex-col justify-between shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div>
                  <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
                  <p className="text-gray-200 mb-6">{card.description}</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors w-fit">
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