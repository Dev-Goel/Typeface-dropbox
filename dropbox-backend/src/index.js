const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve static files

app.use("/api", fileRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
