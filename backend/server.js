const app = require("./app");
const connectDB = require("./config/databaseConnection");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// DB connect
connectDB();

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});