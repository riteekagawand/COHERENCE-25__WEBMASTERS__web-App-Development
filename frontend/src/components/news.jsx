import  { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Sidebar from './Sidebar';

const News = () => {
  const [, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const apiKey = import.meta.env.VITE_MEDIASTACK_API_KEY;
        if (!apiKey) {
          throw new Error('Mediastack API key is missing. Please set VITE_MEDIASTACK_API_KEY in your .env file.');
        }

        let url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&countries=in&languages=en&limit=25`;

        if (activeFilter === 'Entertainment') {
          url += '&categories=entertainment';
        } else if (activeFilter === 'Government') {
          url += '&keywords=government,politics,policy';
        } else if (activeFilter === 'Mumbai-Specific') {
          url += '&keywords=Mumbai';
        } else if (activeFilter === 'Sports') {
            url += '&keywords=sports,cricket,ipl';
          }

        const response = await fetch(url);
        const data = await response.json();

        console.log('Mediastack API Response:', data);

        if (data.error) {
          throw new Error(data.error.message || 'Unknown error from Mediastack API');
        }

        if (data.data && data.data.length > 0) {
          const mappedArticles = data.data.map((item) => ({
            url: item.url,
            title: item.title,
            description: item.description || 'No description available.',
            source: { name: item.source },
            publishedAt: item.published_at,
            category: item.category || 'general',
            image: item.image || 'https://via.placeholder.com/150',
          }));
          setArticles(mappedArticles);
          setFilteredArticles(mappedArticles);
        } else {
          setError('No articles found for India. Try again later.');
        }
      } catch (err) {
        setError('Error fetching news: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading news...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className=" bg-[#d1ebc9] min-h-screen">
      <Sidebar />
      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        {['All', 'Mumbai-Specific', 'Government', 'Entertainment', 'Sports'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-[#1A2417] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {filteredArticles.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No news articles available.</p>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.url}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              style={{ aspectRatio: '1 / 1' }}
            >
              <div className="flex flex-col h-full relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-2/3 object-cover rounded-t-xl"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{article.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate">{article.source.name}</p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <FaArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default News;