// Requiring module 
var express = require('express');
var cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/auth');
var createError = require('http-errors'); 

// Creating express app 
var app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Port Number 
const PORT = process.env.PORT || 3000

// enabling CORS for some specific origins only. 
let corsOptions = { 
    origin : ['http://localhost:5173'], 
}

// enabling CORS for any unknown origin(https://xyz.example.com) 
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))


const db = require("./models");
db.sequelize.sync({force: false}).then(() => {
    initial();
});

async function initial() {
    const Role = db["roles"];
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    if (!adminRole) {
        Role.create({
            id: 1,
            name: "admin"
        });
    }
    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) {
        Role.create({
            id: 2,
            name: "user"
        }); 
    }
    const User = db["users"];
    const admin = await User.findOne({ where: { email: "admin@gmail.com" } });
    const hashedPassword = await bcrypt.hash("12345678", 10);
    if (!admin) {
        User.create({
            username: "Administrator",
            email: "admin@gmail.com",
            password: hashedPassword,
            roleId: 1
        }); 
    }
    const user = await User.findOne({ where: { email: "user@gmail.com" } });
    const _hashedPassword = await bcrypt.hash("12345678", 10);
    if (!user) {
        User.create({
            username: "User",
            email: "user@gmail.com",
            password: _hashedPassword,
            roleId: 2
        });
    }
}
  

// api routes for book management system 

const indexRouter = require('./routes/index'); 
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

app.use('/', indexRouter);
app.use('/users', authMiddleware, usersRouter);
app.use('/books', authMiddleware, booksRouter);

app.use(function (req, res, next) { 
    next(createError(404)); 
});

// Server setup 
app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`)
});