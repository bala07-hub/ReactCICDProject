import React, { useState, useEffect } from 'react';

// Utility function to generate a random hex color
const generateRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Utility function to determine if text should be light or dark based on background color
const getTextColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // Calculate Luma (brightness) using the formula: 0.299*R + 0.587*G + 0.114*B
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;

  // If Luma is greater than 150 (out of 255), use dark text, otherwise use light text
  return luma > 150 ? 'text-gray-900' : 'text-gray-100';
};

// Color Swatch Component
const ColorSwatch = ({ color, onRemove }) => {
  const textColorClass = getTextColor(color);

  // Function to copy the hex code to the clipboard
  const copyToClipboard = () => {
    try {
      // Use execCommand for broader compatibility in sandboxed environments (like iframes)
      const textarea = document.createElement('textarea');
      textarea.value = color;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      // Optional: Provide visual feedback (e.g., a toast or alert replacement)
      console.log(`${color} copied to clipboard!`);
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center p-6 m-2 transition duration-300 transform hover:scale-[1.02] rounded-xl shadow-lg cursor-pointer h-36 md:h-48 lg:h-56 w-full"
      style={{ backgroundColor: color }}
      onClick={copyToClipboard}
      title={`Click to copy ${color}`}
    >
      <div className={`text-xl font-mono font-bold select-all ${textColorClass} mb-2`}>
        {color}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the copy action when removing
          onRemove();
        }}
        className={`absolute top-2 right-2 p-1 rounded-full text-xs transition duration-200 opacity-80 hover:opacity-100 hover:scale-110 ${
          textColorClass === 'text-gray-900' ? 'bg-white/50 text-gray-900 hover:bg-white' : 'bg-gray-900/50 text-gray-100 hover:bg-gray-800'
        }`}
        aria-label="Remove color"
        title="Remove color"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  // Initialize with 4 random colors
  const [colors, setColors] = useState(() =>
    Array.from({ length: 4 }, generateRandomHexColor)
  );
  const [message, setMessage] = useState('');

  // Function to add a new random color
  const addColor = () => {
    const newColor = generateRandomHexColor();
    setColors(prevColors => [...prevColors, newColor]);
    setMessage('New color added!');
  };

  // Function to remove a color by its index
  const removeColor = (indexToRemove) => {
    setColors(prevColors => prevColors.filter((_, index) => index !== indexToRemove));
    setMessage('Color removed!');
  };

  // Clear message after a short delay
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          React Color Palette Generator
        </h1>
        <p className="text-lg text-gray-600">
          Click on a swatch to copy the hex code.
        </p>
      </header>

      {/* Floating Message Box */}
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl transition-opacity duration-300 z-50 animate-bounce-in">
          {message}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={addColor}
          className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Generate New Color</span>
        </button>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {colors.map((color, index) => (
          <ColorSwatch
            key={index} // Using index as key is acceptable here since items are not reordered
            color={color}
            onRemove={() => removeColor(index)}
          />
        ))}
      </div>

      {/* Footer / Info */}
      <footer className="text-center mt-12 pt-6 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          A simple React app built with state management and Tailwind CSS for rapid prototyping.
        </p>
      </footer>

      {/* Custom CSS for animation (Tailwind's utility classes are prioritized, but we'll define a simple custom bounce-in for the message) */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: translate(-50%, -100px) scale(0.5); opacity: 0; }
          60% { transform: translate(-50%, 4px) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out forwards;
        }
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;