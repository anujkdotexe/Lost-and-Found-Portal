# FindIt - Lost and Found Portal

A cute and community-driven Lost and Found portal built with the MEAN (MongoDB, Express, Angular, Node.js) stack. Help reunite items with their owners through a simple, light-mode interface and real-time messaging.

## Features

- **Premium Angular UI**: Built with Angular 19+ featuring **Zoneless** change detection, HSL-pastel palettes, rounded UI elements, and glassmorphism.
- **Community Board**: Browse lost/found items with category filters and search.
- **Item Posting**: Multi-part form for uploading item details and photos (integrated with Cloudinary).
- **Real-time Chat**: Bi-directional messaging powered by Socket.io for safe and quick coordination.
- **State management**: Powered by Angular **Signals** for reactive and performant state handling.
- **Secure Auth**: JWT-based user accounts with persistent sessions.
- **Status Tracking**: Ability for owners to mark items as "Claimed" once resolved.

## Tech Stack

- **Frontend**: Angular, Tailwind CSS v4, Lucide Icons, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (Mongoose)
- **Image Storage**: Cloudinary API

## Screenshots

![Home Page](docs/screenshots/home.png)
![Dashboard](docs/screenshots/dashboard.png)
![Item Detail](docs/screenshots/itemdetail.png)
![Chat Interface](docs/screenshots/chat.png)
![Login](docs/screenshots/login.png)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd "Lost and Found Portal"
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

3. **Frontend (Angular) Setup**:
   ```bash
   cd ../frontend-angular
   npm install
   ```

4. **Run the Application**:
   - Start Backend: `cd backend && npm run start`
   - Start Frontend: `cd frontend-angular && npm start`

## Credits

Built with love for the 6th Semester Lab Project.
