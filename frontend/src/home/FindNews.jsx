import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const News = () => {
  const newsItems = [
    {
      title: '"Making City Smart"',
      description: "Mumbai’s Green Revolution: How sustainable housing is changing urban lifestyles",
      img: 'https://images.pexels.com/photos/2661922/pexels-photo-2661922.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Urban Innovation',
      description: '"Transforming Mumbai: Cutting-Edge Innovations Shaping the City’s Future"',
      img: 'https://images.pexels.com/photos/31342719/pexels-photo-31342719/free-photo-of-modern-architectural-structure-under-cloudy-sky.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      title: 'Smart Living',
      description: 'Smart Governance & E-Services: Digital transformation of BMC services',
      img: 'https://media.istockphoto.com/id/1369709162/photo/mumbai-city-scape.jpg?b=1&s=612x612&w=0&k=20&c=C5dzOE1Dl31my6hhmyLQ2vfxpGybaotaTvWt0NEH08g=',
    },
  ];

  const CustomPrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <button
        className={`${className} slick-prev font-grotesk !w-10 !h-10 sm:!w-12 sm:!h-12 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors !left-0 sm:!left-[-50px]`}
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
        className={`${className} slick-next font-grotesk w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors absolute right-1 sm:right-4 md:right-5 z-1`}
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
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
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
    <section id="news-updates" className="py-8 sm:py-12 lg:py-16 min-w-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-grotesk font-bold tracking-tight mb-4 sm:mb-0">
            Find out the latest News
          </h2>
          <button className="text-base sm:text-lg font-grotesk font-semibold flex items-center gap-2 hover:text-gray-600 transition-colors">
            View All
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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

        <Slider {...settings}>
          {newsItems.map((item, index) => (
            <div key={index} className="px-2">
              <div className="relative group bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 h-[230px] transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white font-grotesk text-black px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base">
                      Read More
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{item.description}</p>
                  <button className="text-sm font-grotesk sm:text-base font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                    Find Out More
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

export default News;