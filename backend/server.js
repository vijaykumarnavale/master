const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const dashboardRoute = require('./routes/dashboard');
const forgotPassword=require('./routes/forgot_password');
const resetPassword=require('./routes/forgot_password');
const getAllUsers = require('./routes/all_users');
const updateUser = require('./routes/updateUser');
const deleteUser = require('./routes/deleteUser');
const getSingleData = require('./routes/search');
const post_data = require('./routes/post_data');
const getAllPropertiesData = require('./routes/get_property_data');
const getPermitedUsesData = require('./routes/get_permited_uses_data');
const fileUpload = require('./routes/file_upload');
const zoningRules=require('./routes/zoning_rules');

const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for cross-origin requests

// Routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboardRoute);
app.use('/',forgotPassword);
app.use('/', resetPassword);
app.use('/', getAllUsers);
app.use('/', updateUser);
app.use('/', deleteUser);
app.use('/', getSingleData);
app.use('/',post_data);
app.use('/',getAllPropertiesData);
app.use('/',getPermitedUsesData);
app.use('/', fileUpload);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/',zoningRules);

// Home Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Node.js Authentication System');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
