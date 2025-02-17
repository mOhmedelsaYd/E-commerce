That's great! Since the project is deployed, users can directly test the project by using the **Postman** link you provided. Here's an updated version of the **README** file that indicates that the project is deployed and can be tested directly via Postman:

---

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

5. Start the development server:
   ```bash
   npm run start:dev
   ```

   The server should now be running on `http://localhost:5000`.

## Usage

### Using Postman to Test API

If the project is deployed, you can directly test the API by using the **Postman** collection shared below. The collection allows you to interact with the deployed project without needing to set it up locally.

1. **Set up Postman**:
   - Install **Postman** from [here](https://www.postman.com/downloads/).
   - Open **Postman** and import the provided collection.

2. **Test API Endpoints**:
   After deploying the app, you can use the following Postman collection to test the API endpoints remotely. Just click the link below:

   [Test the Project API on Postman](https://www.postman.com/depi-team-1582/workspace/my-workspace/collection/31981755-13336574-1f2f-4838-9524-b2e797a370c0?action=share&creator=31981755&active-environment=31981755-c98099c7-05b2-4e18-954c-8f874ac1e120)

   This collection includes all the necessary API calls to interact with the deployed project.

## Security Features

- **Brute Force Protection**: Account lockout after a certain number of failed login attempts.
- **SQL Injection Protection**: Prevents malicious SQL injection by sanitizing inputs.
- **XSS Protection**: Ensures that user inputs do not contain executable scripts.
- **HPP Protection**: Prevents HTTP Parameter Pollution by validating incoming requests.

## Contribution

Feel free to fork this repository, create a branch, and submit a pull request with your changes or improvements.

## License

This project is licensed under the MIT License.

---

This version of the **README** includes the link to your deployed **Postman collection**, allowing users to directly test the API without any setup. Let me know if you need anything else!
