require("dotenv").config();
// require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./cors/options");
const connectDB = require("./database/db");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;

console.log(process.env.NODE_ENV);

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
connectDB();

// app.use("/", require("./routers/root"));
app.use("/", require("./routers/add-case"));
app.use("/auth", require("./routers/auth"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "mine/build")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "mine", "build", "index.html")));
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err);
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// app.all("*", (req, res) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ message: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
