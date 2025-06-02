import React from 'react';

import NavigationBar from './components/navigationbar';
import QuestionFlow from './components/questionflow';
import Footer from './components/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Header - no video background */}
      <NavigationBar />
      
      {/* Central content with video background */}
      <div className="relative flex-1">
        {/* Video background - only for central area */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/videos/background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video overlay */}
          <div className="absolute inset-0  bg-opacity-20"></div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10 max-w-2xl mx-auto my-10 bg-white bg-opacity-95 rounded-xl shadow-lg p-6">
          <QuestionFlow />
        </div>
      </div>
      
      {/* Footer - no video background */}
      <div className="w-full bg-gray-200 p-4">
        <Footer />
      </div>
    </div>
  );
}