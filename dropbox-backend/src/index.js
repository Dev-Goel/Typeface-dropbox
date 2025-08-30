const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve static files

const uploadRequest = {};
const LIMIT = 1;
const WINDOW = 10*1000;

function rateLimiter(req, res, next) {
    const ip = req.ip;

    const now = Date.now();
    if(!uploadRequest[ip]){
        uploadRequest[ip] = [];
    }

    uploadRequest[ip] = uploadRequest[ip].filter(ts => now-ts < WINDOW);
    

    if(uploadRequest[ip].length >= LIMIT){
        return res.status(429).json({error: "Too many requests"});
    }

    uploadRequest[ip].push(now);
    next();
}

app.use("/api/upload", rateLimiter);
app.use("/api", fileRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
