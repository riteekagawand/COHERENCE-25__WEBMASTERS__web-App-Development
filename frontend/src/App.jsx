import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import USP from './components/USP';
import News from './components/News';
import TimeSaver from './components/TimeSaver';
import TrafficAnalysis from './components/TrafficAnalysis';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <USP />
      <News />
      <TimeSaver />
      <TrafficAnalysis />
      <Footer />
    </div>
  );
}

export default App;