React Color Palette Generator

A simple, fast, and responsive web application built to generate, view, and manage random color palettes. Users can add new random colors, remove existing swatches, and click on any color swatch to instantly copy its hexadecimal code to the clipboard.

✨ Features

Random Generation: Instantly generate a new, unique hex color on demand.

Copy to Clipboard: Click any color swatch to copy the hex code.

Responsive Grid: Color swatches are displayed in a responsive grid layout that adapts to all screen sizes (mobile, tablet, and desktop).

Real-time Updates: Utilizes React state for a smooth, real-time user experience.

Contrast Check: Automatically determines and applies light or dark text color for optimal readability of the hex code against the background color.

💻 Technology Stack

Frontend: React (Functional Components and Hooks)

Styling: Tailwind CSS (Utility-first framework for rapid styling)

Build Tool: Vite

🚀 Getting Started

Follow these steps to set up the project locally.

Prerequisites

You need to have Node.js (version 18 or higher) and npm installed on your machine.

Installation

Clone the Repository:

git clone [YOUR_REPO_URL] color-palette-generator
cd color-palette-generator


Install Dependencies:

This command installs all necessary project dependencies, including React, Tailwind CSS, and Vite.

npm install


Running the Application

Once the dependencies are installed, you can start the development server:

npm run dev


The application will be accessible in your web browser at: http://localhost:5173/

🎨 Project Structure

The core logic and styling configuration are contained in these files:

src/App.jsx: Contains the main React component, all state management, utility functions, and component logic.

src/main.jsx: The React entry point that renders the <App /> component.

src/index.css: Imports the necessary Tailwind CSS layers (@tailwind base, @tailwind components, @tailwind utilities).

tailwind.config.js: Tailwind configuration file, specifying content paths.

postcss.config.js: PostCSS configuration, integrating the Tailwind plugin.

🤝 Contribution

Feel free to fork the repository and contribute! Any suggestions for improving the color generation algorithms or UI/UX are welcome.
