# FindIt - Lost and Found Portal 🌟

A cute and community-driven Lost and Found portal built with the MERN stack. Help reunite items with their owners through a simple, light-mode interface and real-time messaging.

## ✨ Features

- **Cute & Simple UI**: Built with Tailwind CSS v4 and a pastel aesthetic.
- **Community Board**: Browse lost/found items with category filters and search.
- **Item Posting**: Upload details and photos (integrated with Cloudinary).
- **Real-time Chat**: Bi-directional messaging powered by Socket.io.
- **Secure Auth**: JWT-based user accounts.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide React
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (Mongoose)
- **Image Storage**: Cloudinary

## 📸 Screenshots

![Home Page](docs/screenshots/home.png)
![Dashboard](docs/screenshots/dashboard.png)
![Item Detail](docs/screenshots/itemdetail.png)
![Chat Interface](docs/screenshots/chat.png)
![Login](docs/screenshots/login.png)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd "MERN Project"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application**:
   - Start Backend: `cd backend && npm run start`
   - Start Frontend: `cd frontend && npm run dev`

## 💖 Credits

Built with love for the 6th Semester Lab Project.
