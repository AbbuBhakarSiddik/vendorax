# VendoraX

VendoraX is a comprehensive, multi-role e-commerce platform built with the MERN stack. It enables seamless interactions between buyers, sellers, and administrators, offering a complete digital storefront experience with real-time updates and secure payments.

## 🚀 Features

### Multi-Role System
* **Buyers:** Browse products, manage cart, place orders, and track order status.
* **Sellers:** Create and manage their own digital storefronts, manage product inventory, and fulfill orders.
* **Admins:** Oversee platform activity, manage users, and monitor overall analytics.

### Key Functionalities
* **Secure Payments:** Integrated with Razorpay for secure and seamless checkout experiences (supports Cards, UPI, Net Banking, and Wallets).
* **Real-time Notifications:** Utilizes Socket.io to provide instant updates on order status changes and new orders.
* **Shopping Cart & Checkout:** Persistent cart state using Zustand and seamless multi-store checkout.
* **Responsive Design:** A modern, mobile-friendly user interface built with Tailwind CSS.
* **Image Management:** Integrated with Cloudinary for robust product and store image hosting.

## 🛠️ Technology Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* Zustand (State Management)
* React Router DOM
* Axios

**Backend:**
* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.io (Real-time WebSockets)
* Razorpay SDK (Payments)
* Cloudinary (Image Storage)
* JSON Web Tokens (JWT) for Authentication

## ⚙️ Local Development Setup

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB database (local or Atlas)
* Razorpay Account (for payment API keys)
* Cloudinary Account (for image hosting)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/AbbuBhakarSiddik/vendorax.git
cd vendorax
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd vendorax-backend
npm install
\`\`\`

Create a \`.env\` file in the `vendorax-backend` directory with the following variables:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=development

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Config
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
\`\`\`

Start the backend development server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd vendorax-frontend
npm install
\`\`\`

Create a \`.env\` file in the `vendorax-frontend` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api/v1
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Access the App
Open your browser and navigate to \`http://localhost:5173\` (or the port Vite provides).

## 📄 License
This project is licensed under the MIT License.