# Legal Link Project 🧑‍💼👩‍⚖️

This is a full-stack legal management platform built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It features three distinct user portals: a Client Portal for case submission, a Lawyer Portal for professional management, and an Admin Portal for user verification.

-----

## Project Structure

The project is divided into two main folders: `backend` for the server-side code and `frontend` for the client-side code.

```
legal-portal/
├── backend/
│   ├── models/
│   │   └── User.js              # Universal schema for all user roles (Admin, Client, Lawyer)
│   ├── middleware/
│   │   ├── auth.js              # Verifies JWT for general access
│   │   └── adminAuth.js         # Verifies JWT and checks for 'admin' role
│   ├── routes/
│   │   ├── auth.js              # Handles user registration and login
│   │   ├── lawyer.js            # Lawyer-specific routes (e.g., document upload)
│   │   └── admin.js             # Admin-specific routes (e.g., lawyer verification)
│   ├── uploads/                 # Storage for uploaded lawyer documents
│   ├── .env.example             # Template for environment variables
│   └── server.js                # Main server file
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Main application pages
    │   └── App.js               # Main React router
    ├── .env.example
    └── package.json
```

-----

## Getting Started

### Prerequisites

You need to have the following installed on your machine:

  * **Node.js & npm**
  * **MongoDB:** You can either install it locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Step 1: Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/legal-portal.git
cd legal-portal
```

### Step 2: Backend Setup

1.  Navigate into the `backend` folder:

    ```bash
    cd backend
    ```

2.  Install the server-side dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file from the example:

      * Create a file named `.env` in the `backend` folder.
      * Copy the content from `.env.example` and replace the placeholder values with your own.

    <!-- end list -->

    ```
    PORT=5000
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_Secret_Key>
    ```

4.  Start the backend server:

    ```bash
    npm run server
    ```

    The server will run on `http://localhost:5000`. You will see "MongoDB Connected..." in the console if the connection is successful.

### Step 3: Frontend Setup

1.  Open a new terminal and navigate to the `frontend` folder:
    ```bash
    cd ../frontend
    ```
2.  Install the client-side dependencies. If you encounter a dependency conflict error (`ERESOLVE`), use the `--legacy-peer-deps` flag:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Start the React development server:
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

-----

## Key Features Implemented

  * **Universal Authentication:** A single set of API endpoints handles registration and login for all three user roles (**Client**, **Lawyer**, **Admin**).
  * **Detailed User Models:** The `User` model is designed to store role-specific information, such as `govId` for clients and `barCouncilId` for lawyers.
  * **Lawyer Verification Flow:**
      * Lawyers register with a `pending` status.
      * A dedicated API route (`/api/lawyer/upload-documents`) allows lawyers to upload their ID and degree.
      * Uploaded files are stored in the `backend/uploads` folder.
  * **Admin Management:**
      * A protected `admin` route allows an admin to fetch a list of all lawyers.
      * The admin can approve a lawyer by updating their `isVerified` status.
  * **Secure API:** All sensitive routes are protected with **JWT-based authentication middleware**.
  * **File Uploads:** The `multer` library is configured to handle `multipart/form-data` for secure and efficient document uploads.

-----

## Contributing

This is a group project. Feel free to clone this repository and start working on your assigned tasks. Please create a new branch for each feature and submit a pull request when ready.

  * `git checkout -b feature/your-feature-name`
  * `git push origin feature/your-feature-name`

Happy coding\!
