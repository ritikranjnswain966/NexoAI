# Nexo AI

Nexo is a full-stack AI-powered chat application. It allows users to interact with an advanced AI model, featuring beautifully styled code blocks, a user-friendly interface, and a built-in credit/payment system.

## Features

- **AI Chatbot**: Intelligent conversational AI powered by OpenAI.
- **Code Syntax Highlighting**: Styled code blocks in the chat using PrismJS and React Syntax Highlighter.
- **Credit System**: Users can purchase credits to use the AI, integrated securely with Stripe.
- **Authentication & Webhooks**: Secure user management and real-time event handling using Svix (typically paired with Clerk).
- **Responsive UI**: Modern interface built with React, Tailwind CSS v4, and Vite.
- **Robust Backend**: Node.js and Express server with a MongoDB database via Mongoose.

## Tech Stack

### Frontend (Client)

- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Markdown & Code**: `react-markdown`, `prismjs`, `react-syntax-highlighter`
- **State/Notifications**: `react-hot-toast`, `axios`

### Backend (Server)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs
- **Payments**: Stripe
- **AI Integration**: Gemini SDK
- **Media Storage**: ImageKit
- **Webhooks**: Svix

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB connection string
- API Keys for OpenAI, Stripe, ImageKit, and Clerk (if applicable)

### Installation

1. **Clone the repository**.
2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```
3. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` directory and add your secret keys:

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
OPENAI_API_KEY=<your-openai-api-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
JWT_SECRET=<your-jwt-secret>
# Add other necessary keys such as ImageKit and Svix webhook secrets
```

### Running the App

**Start the Backend Server**:

```bash
cd server
npm run server
```

**Start the Frontend Development Server**:

```bash
cd client
npm run dev
```

## License

ISC License
