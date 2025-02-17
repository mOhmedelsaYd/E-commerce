# E-commerce Project

This is a full-fledged **E-commerce** application built using the **Node.js** and **MERN** stack. It features essential functionalities like user authentication, product management, shopping cart, payment integration with **Stripe**, and security measures to protect against various attacks.

## Features

- **User Authentication**: JWT-based authentication for secure login and registration.
- **Shopping Cart**: Allows users to add, remove, and manage items in their cart.
- **Order Management**: Users can place orders and view their order history.
- **Search and Filter**: Advanced search, sort, and filter functionality to enhance user experience.
- **Stripe Payment Integration**: Users can securely make payments using **Stripe**.
- **Image Upload**: Users can upload product images using **Multer**.
- **Security Features**: Protection against attacks like brute-forcing, SQL Injection, Cross-Site Scripting (XSS), and HTTP Parameter Pollution (HPP).
- **Error Handling & Validation**: Proper error handling and input validation to ensure a stable app.

## Tech Stack

- **Frontend**: Not included in this repository (use your preferred frontend framework).
- **Backend**:  
  - **Node.js**  
  - **Express.js**
  - **MongoDB**  
  - **JWT** for user authentication  
  - **Multer** for image upload  
  - **Stripe API** for payment integration  

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB locally](https://www.mongodb.com/try/download/community) or use a cloud database like MongoDB Atlas.
- **Stripe Account**: [Create a Stripe account](https://stripe.com) to get your API keys.

### Steps to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/mOhmedelsaYd/E-commerce.git
   ```

2. Navigate to the project directory:
   ```bash
   cd E-commerce
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

5. Start the development server on port 8000:
   ```bash
   npm start
   ```

   The server should now be running on `http://localhost:8000`.

## Usage

### 1. **Test API Locally**

Once the application is running locally, you can interact with the API by making requests to `http://localhost:8000`. You can test the various API endpoints by using tools like **Postman** or **curl**.

### 2. **Test API Using Postman Documentation**

Alternatively, you can directly test the deployed project API by using the Postman documentation. Simply click the link below to access the interactive API documentation and test it without setting it up locally:

[View and Test the Project API Documentation](https://documenter.getpostman.com/view/31981755/2sAYXFhH97)

The Postman documentation includes all the necessary API calls to interact with the deployed project.

## Security Features

- **Brute Force Protection**: Account lockout after a certain number of failed login attempts.
- **SQL Injection Protection**: Prevents malicious SQL injection by sanitizing inputs.
- **XSS Protection**: Ensures that user inputs do not contain executable scripts.
- **HPP Protection**: Prevents HTTP Parameter Pollution by validating incoming requests.

## Contribution

Feel free to fork this repository, create a branch, and submit a pull request with your changes or improvements.

## License

This project is licensed under the MIT License.
