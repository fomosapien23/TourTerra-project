# TourTerra Project
![Alt Text](https://github.com/fomosapien23/TourTerra-project/blob/main/public/asset/Screenshot%202024-08-06%20001328.png)



A major project using the MERN stack, designed as a clone of Airbnb. This project allows users to list their homes and search for destinations. 
Live : https://tourterra.onrender.com/listHome

## Table of Contents

- [TourTerra Project](#tourterra-project)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Author](#author)

## Description

TourTerra is a web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It serves as a clone of Airbnb, providing users the ability to list their homes for rent and search for rental properties in various destinations.

## Features

- User authentication and authorization using Passport.js.
- Ability to list properties with images, descriptions, and prices.
- Search functionality to find properties based on location.
- Image upload using Cloudinary and Multer.
- Data validation with Joi.
- Flash messages for user feedback.
- Session management with express-session.

## Technologies Used

- **Frontend**: EJS, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js, passport-local, passport-local-mongoose
- **File Upload**: Multer, multer-storage-cloudinary, Cloudinary
- **Validation**: Joi
- **Session Management**: express-session
- **Flash Messages**: connect-flash
- **Environment Variables**: dotenv
- **Geocoding**: @mapbox/mapbox-sdk

## Installation

  1. Clone the repository:
     ```sh
     git clone https://github.com/yourusername/tourterra-project.git
     cd tourterra-project
  2. Install dependencies:
     ```sh
     npm install
  3. Create a .env file in the root directory and add your configuration:
     ```sh
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_KEY=your_cloudinary_key
      CLOUDINARY_SECRET=your_cloudinary_secret
      MAPBOX_TOKEN=your_mapbox_token
      SESSION_SECRET=your_session_secret
  
  4. Start the application:
     ```sh
      Copy code
      npm app.js

## Usage
 - Visit http://localhost:1080 to see the application in action.
 - Sign up or log in to start listing your home or searching for destinations.

## Contributing
 - Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
  This project is licensed under the ISC License.

## Author
  @Rohan_rai
