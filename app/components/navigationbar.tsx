
import React from 'react';

const NavigationBar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-lg font-bold">BANANKI</div>
            <ul className="flex space-x-6">
                <li className="hover:underline cursor-pointer">Home</li>
                <li className="hover:underline cursor-pointer">Explore</li>
                <li className="hover:underline cursor-pointer">Support</li>
            </ul>
        </nav>
    );
};

export default NavigationBar;