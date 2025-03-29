// eslint-disable-next-line no-unused-vars
import React from 'react'
import Header from './Navbar'
import HeroSection from './Hero'
import USP from './USP'
import News from './FindNews'
import TimeSaver from './TimeSaver'
import Traffic from './TrafficAnalysis'
import Footer from './Footer'


const Home = () => {
  return (
    <div>
      <div >
      <Header />
      </div>
      <HeroSection />
      <USP />
      <News />
      <TimeSaver />
      <Traffic />
      <Footer />
    </div>
  )
}

export default Home