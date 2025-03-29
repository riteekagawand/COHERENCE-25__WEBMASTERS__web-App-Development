import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const USP = () => {
  const properties = [
    {
      title: 'Smart Infrastructure',
      address: '"Future-Ready Urban Development"',
      img: 'https://images.pexels.com/photos/28884704/pexels-photo-28884704/free-photo-of-urban-electric-car-charging-station-in-glasgow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Sustainable Living',
      address: '"Green, Clean, and Energy-Efficient"',
      img: 'https://images.pexels.com/photos/29989224/pexels-photo-29989224/free-photo-of-scenic-traditional-house-amidst-bali-rice-fields.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Smart Security & Governance',
      address: '"Seamless Connectivity for a Smarter Tomorrow"',
      img: 'https://images.pexels.com/photos/6347539/pexels-photo-6347539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
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

  const CustomPrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <button
        className={`${className} font-grotesk min-w-screen slick-prev !w-10 !h-10 sm:!w-12 sm:!h-12 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors !left-0 sm:!left-[-50px]`}
        onClick={onClick}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );
  };

  const CustomNextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <button
        className={`${className} slick-next font-grotesk w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors absolute right-2 sm:right-4 md:right-5 z-10`}
        onClick={onClick}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );
  };
  

  return (
    <section id='usp' className=" py-8 sm:py-12 lg:py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-grotesk font-bold tracking-tight mb-4 sm:mb-0">
            What are our USP ??
          </h2>
          <button className="text-base sm:text-lg font-grotesk font-semibold flex items-center gap-2 hover:text-gray-300 transition-colors">
            View All
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 font-grotesk"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />}>
          {properties.map((property, index) => (
            <div key={index} className="px-2">
              <div className="relative group font-grotesk bg-gray-800 rounded-sm  overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-sm">
                <div className="relative">
                  <img
                    src={property.img}
                    alt={property.title}
                    className="w-full h-40 sm:h-48 font-grotesk md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 h-[230px]  transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black font-grotesk px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base">
                      Explore
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
                  
                    {property.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default USP;