# VendoraX

VendoraX is a comprehensive, multi-role e-commerce platform built with the MERN stack. It enables seamless interactions between buyers, sellers, and administrators, offering a complete digital storefront experience with real-time updates and secure payments.

<img width="1881" height="845" alt="Screenshot 2026-06-18 064319" src="https://github.com/user-attachments/assets/a06a1d74-c181-44c2-a6b7-57ee9c70f3be" />
<img width="1205" height="794" alt="Screenshot 2026-06-18 064200" src="https://github.com/user-attachments/assets/64488547-d275-43b3-af5c-e64e0c7e30bf" />
<img width="1223" height="871" alt="Screenshot 2026-06-18 063803" src="https://github.com/user-attachments/assets/0a8d4f3b-33de-41d6-82fd-bd7e7247be35" />
<img width="1406" height="685" alt="Screenshot 2026-06-18 063933" src="https://github.com/user-attachments/assets/d6eaf425-d873-40b3-b542-241a1c76ccc7" />
<img width="1472" height="833" alt="Screenshot 2026-06-18 064011" src="https://github.com/user-attachments/assets/4f3cf29a-a151-48e9-9562-869bcda3e1d3" />
<img width="1453" height="794" alt="Screenshot 2026-06-18 064109" src="https://github.com/user-attachments/assets/bb7fb72e-1d6b-4abd-a61f-ce946cd34b32" />
<img width="1457" height="869" alt="Screenshot 2026-06-18 064136" src="https://github.com/user-attachments/assets/ed435239-a4c3-48b0-90a9-17173366fdbc" />
<img width="1545" height="853" alt="Screenshot 2026-06-18 063910" src="https://github.com/user-attachments/assets/06bc39f8-c60d-49a9-a012-4dd4aaedc411" />
<img width="1471" height="826" alt="Screenshot 2026-06-18 063827" src="https://github.com/user-attachments/assets/be19748d-aa07-484b-bca1-cf233af79df5" />

## 🚀 Features

### Multi-Role System
* **Buyers:** Browse products, manage cart, place orders, and track order status.
* **Sellers:** Create and manage their own digital storefronts, manage product inventory, and fulfill orders.
* **Admins:** Oversee platform activity, manage users, and monitor overall analytics.

### Key Functionalities
* **Secure Payments:** Integrated with Razorpay for secure and seamless checkout experiences (supports Cards, UPI, Net Banking, and Wallets).
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
\`\`\`
git clone https://github.com/AbbuBhakarSiddik/vendorax.git
cd vendorax
\`\`\`

### 2. Backend Setup
\`\`\`
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
\`\`\`
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`
cd vendorax-frontend
npm install
\`\`\`

Create a \`.env\` file in the `vendorax-frontend` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api/v1
\`\`\`

Start the frontend development server:
\`\`\`
npm run dev
\`\`\`

### 4. Access the App
Open your browser and navigate to \`http://localhost:5173\` (or the port Vite provides).

## 📄 License
This project is licensed under the MIT License.
