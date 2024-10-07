# CareerStar - Open Source Code

Welcome to the **CareerStar** open-source repository! CareerStar LLC is proud to share this code with the open-source community to foster collaboration and innovation. This repository contains the core components of our platform designed to help individuals kickstart their careers by providing personalized roadmaps and insights.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

CareerStar is a platform that helps users build a personalized roadmap for their career by suggesting activities and learning paths tailored to their goals. Our platform uses data analytics and machine learning to create dynamic and adaptable profiles for users based on their unique needs.

**CareerStar LLC** owns the code, but we’ve made this repository open source to allow the community to contribute, build on our code, and create new possibilities together.

## Features

- Dynamic user roadmaps based on career goals and progress.
- Data analysis to identify emerging trends in user behavior and engagement.
- Scalable backend architecture optimized for performance.
- Machine learning integration to provide personalized suggestions for users. (Under development)
- User-friendly dashboard and data visualization for decision-making. (Under development)

## Technologies Used

- **Frontend:** React
- **Backend:** Python, Flask
- **Database:** PostgreSQL, AWS RDS PostgreSQL
- **Cloud Storage:** AWS S3
- **Hosting:** AWS EC2
- **Machine Learning:** Python (SciKit-Learn, TensorFlow, etc.)

## Installation

To get a local copy of the project up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   https://github.com/Meet1903/CareerStar.git
   cd careerstar-opensource
   ```

2. **Install dependencies:**

    For the backend:

    ```bash
    pip install -r backend/requirements.txt
    ```

    For the frontend:
    ```bash
    cd frontend
    npm install
    ```

3. **Set up environment variables:**
    Create a .env file for your environment variables in the backend folder. Include keys for database access, AWS credentials, and other sensitive information.

    DB_HOST=<>

    DB_PORT=<>
    
    DB_NAME=<>
    
    DB_USER=<>
    
    DB_PASSWORD=<>
    
    ADMIN_USERNAME=<>
    
    ADMIN_PASSWORD=<>
    
    SECRET_KEY=<>

4. **Run the application:**
    Start the Flask backend server:
    ```bash
    python backend/app.py
    ```
    Start the React frontend server:
    ```bash
    cd frontend
    npm start
    ```

## Usage

Once installed, you can access the platform by navigating to http://localhost:3000 on your browser.

You can explore the features by:
- Creating a new user profile.
- Navigating the user dashboard to view your personalized roadmap.
- Exploring data visualizations and insights based on user activity.

## Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch (git checkout -b feature/YourFeature).
3. Make your changes and commit them (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/YourFeature).
5. Create a pull request.

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute the code under the terms of the license.

## Contact
For any questions or inquiries, feel free to reach out to us at meet.diwan@careerstar.co