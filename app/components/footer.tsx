"use client"
import React from 'react'

function footer() {
 return (
  <div className="w-full  mx-auto p-2">
   
  <div className="min-w mx-auto text-center">
 
    <div className="flex justify-center space-x-3 mb-2">
      <span className="text-2xl font-bold text-gray-800">BANAKI</span>

    </div>

   
    <nav className="mb-3">
      <ul className=" flex flex-wrap justify-center gap-6 md:gap-8">
        <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Home</a></li>
        <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Mission</a></li>
        <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">How It Works</a></li>
        <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">History</a></li>
      </ul>
    </nav>

  
    <p className="text-gray-500 text-xs">
      Developed by Akmal<br></br><br></br>
      Banaki © All rights reserved.
      <br></br>
      
      
    </p>
  </div>

  </div>
);}

export default footer