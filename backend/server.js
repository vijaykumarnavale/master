const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Static Files
app.use(express.static('wwwroot'));
app.use('/plan', express.static(path.join(__dirname, 'wwwroot')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(require('./routes/auth.js'));
app.use(require('./routes/models.js'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/', require('./routes/forgot_password'));
// app.use('/', require('./routes/reset_password'));
app.use('/', require('./routes/all_users'));
app.use('/', require('./routes/updateUser'));
app.use('/', require('./routes/deleteUser'));
app.use('/', require('./routes/search'));
app.use('/', require('./routes/post_data'));
app.use('/', require('./routes/get_property_data'));
app.use('/', require('./routes/get_permited_uses_data'));
app.use('/', require('./routes/file_upload'));
app.use('/', require('./routes/zoning_rules'));


app.use('/property_update', require('./routes/property_update'));
app.use('/file_upload', require('./routes/file_upload'));


// Home Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Node.js Authentication System');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
