import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const News = () => {
  const newsItems = [
    {
      title: 'Making City Smart',
      description: "Making city smart find out how by making citizen's life hassle free",
      img: 'https://via.placeholder.com/400x300?text=Making+City+Smart',
    },
    {
      title: 'Urban Innovation',
      description: 'Discover the latest trends in urban development and technology',
      img: 'https://via.placeholder.com/400x300?text=Urban+Innovation',
    },
    {
      title: 'Smart Living',
      description: 'How technology is transforming the way we live in cities',
      img: 'https://via.placeholder.com/400x300?text=Smart+Living',
    },
  ];

  const settings = {
    dots: false,
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find out the latest News
          </h2>
          <button className="text-lg font-semibold flex items-center gap-2 hover:text-gray-600 transition-colors">
            View All
            <svg
              className="w-5 h-5"
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
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
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