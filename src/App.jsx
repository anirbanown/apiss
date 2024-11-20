import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import IbmApiIntegration from "./components/IbmApiIntegration";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import "./App.css"; // Import the CSS file for the gradient animation

const App = () => {
  return (
    <div className=" relative">
      {/* Full-Width Gradient Wrapper */}
      <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-r from-black via-blue-950 to-black animated-gradient -z-10"></div>
      
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto pt-20 relative">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        <IbmApiIntegration />
        <Pricing />
        <Testimonials />
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default App;
