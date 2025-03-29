import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TimeSaver = () => {
  const cards = [
    {
      title: 'AQI Effects On Humans',
      description: 'The Air Quality Index (AQI) is a scale used to communicate air quality and its potential health effects on the public.',
      img: 'https://images.pexels.com/photos/221012/pexels-photo-221012.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Browse Articles',
      bgColor: 'bg-[#1f2937]',
    },
    {
      title: 'Traffic Analysis',
      description: 'Traffic analysis involves studying vehicle flow, congestion patterns, and road usage to improve urban mobility.',
      img: 'https://images.pexels.com/photos/31352266/pexels-photo-31352266/free-photo-of-scenic-autumn-street-in-hanoi-with-vibrant-foliage.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Stay Informed',
      bgColor: 'bg-[#1f2937]', // Changed to soft green
    },
    {
      title: 'Noise Pollution Effect',
      description: 'Noise pollution refers to excessive or disturbing sounds that negatively impact human health and the environment.',
      img: 'https://images.pexels.com/photos/16005646/pexels-photo-16005646/free-photo-of-lots-of-road-dust-above-the-street.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Stay Informed',
      bgColor: 'bg-[#1f2937]',
    },
    {
      title: 'Urban Sustainability',
      description: 'Urban sustainability focuses on creating cities that balance economic growth, environmental protection, and well-being.',
      img: 'https://images.pexels.com/photos/2682683/pexels-photo-2682683.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Discover More',
      bgColor: 'bg-[#1f2937]',
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
          slidesToScroll: 1,
          arrows: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <section id="inovations" className="py-8 sm:py-12 lg:py-16 bg-[#101726] text-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Title and Subtitle */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-grotesk">
            Transforming India: Smart Innovations Shaping Tomorrow!
          </h2>
          <p className="text-base sm:text-lg text-white mt-3 sm:mt-4 font-grotesk">
            Innovation Today for a Smarter India Tomorrow!
          </p>
        </div>

        {/* Slider */}
        <Slider {...settings}>
          {cards.map((card, index) => (
            <div key={index} className="px-2 ">
              <div
                className={`${card.bgColor} ${
                  card.title === 'Traffic Analysis' ? 'text-white' : 'text-black'
                } font-grotesk rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
              >
                <div className="relative">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white font-grotesk text-black px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base">
                      Explore
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl text-white font-grotesk font-semibold mb-2">{card.title}</h3>
                    <p className="mb-4 text-sm text-white font-grotesk sm:text-base">{card.description}</p>
                  </div>
                  <button className="text-[#1A2417] bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors w-fit text-sm sm:text-base">
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