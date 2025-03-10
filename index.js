const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const connetDb = require('./config/connectDb.js');
require('dotenv/config');
const ErrorHandler = require('./middleware/error.js');
const xssProtectionMiddleWare = require('./middleware/xssProtectionMail.js');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(xssProtectionMiddleWare);

connetDb();
const corsOptions = {
    origin: [`${process.env.FRONTEND_URL}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


app.use(cors(corsOptions));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});

// Error handler

const userAuthController = require('./controller/userAuthController.js');
const adminPanelController = require('./controller/adminPanelController.js')
const userPanelController = require('./controller/userPanelController.js');

app.use('/api/v1/user-auth', userAuthController);
app.use('/api/v1/admin-panel', adminPanelController);
app.use('/api/v1/user-panel', userPanelController);

app.use(ErrorHandler);

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
})