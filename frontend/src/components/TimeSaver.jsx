import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TimeSaver = () => {
  const cards = [
    {
      title: 'AQI Effects On Humans',
      description: 'Reason of the above',
      img: 'https://via.placeholder.com/400x300?text=AQI+Effects',
      buttonText: 'Browse Articles',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Traffic Analysis',
      description: 'Stay up-to-date using our tips and guides on rent payments, leasing, management solutions, and more.',
      img: 'https://via.placeholder.com/400x300?text=Traffic+Analysis',
      buttonText: 'Stay Informed',
      bgColor: 'bg-gray-900',
    },
    {
      title: 'Noise Pollution Effect',
      description: 'Reason of the above statement',
      img: 'https://via.placeholder.com/400x300?text=Noise+Pollution',
      buttonText: 'Stay Informed',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Urban Sustainability',
      description: 'Learn how to live sustainably in urban environments',
      img: 'https://via.placeholder.com/400x300?text=Urban+Sustainability',
      buttonText: 'Discover More',
      bgColor: 'bg-gray-900',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-green-500 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Yaha kuch aacha Tagline Hona chahye
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Kuch aacha hona chahye yaha pe ya phir information
          </p>
        </div>

        <Slider {...settings}>
          {cards.map((card, index) => (
            <div key={index} className="px-2">
              <div
                className={`${card.bgColor} rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
              >
                <div className="relative">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                      Explore
                    </button>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-200 mb-4">{card.description}</p>
                  </div>
                  <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors w-fit">
                    {card.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TimeSaver;