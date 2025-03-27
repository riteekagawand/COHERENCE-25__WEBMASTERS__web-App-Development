import Sidebar from '../components/Sidebar'; // Adjust path if needed
import News from '../components/News'; // Adjust path if needed

const NewsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* News Content */}
      <div className="flex-1  "> {/* Offset for sidebar width */}
        <News />
      </div>
    </div>
  );
};

export default NewsPage;