const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/databaseConnection");

const User = require("./models/UserModel");
const Visitor = require("./models/VisitorModel");
const Pass = require("./models/PassModel");
const CheckLog = require("./models/CheckLogModel");

const seedData = async () => {
  try {
    await connectDB();

    // ❌ Clear old data
    await User.deleteMany();
    await Visitor.deleteMany();
    await Pass.deleteMany();
    await CheckLog.deleteMany();

    // ✅ Create User
    const user = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "123456",
      role: "admin"
    });

    // ✅ Create Visitors
    const visitor1 = await Visitor.create({
      name: "Rahul",
      email: "rahul@gmail.com",
      purpose: "Meeting",
      host: user._id,
      status: "approved"
    });

    // ✅ Create Pass
    const pass = await Pass.create({
      visitorId: visitor1._id,
      passId: "PASS-" + Date.now(),
      qrCode: "sample-qr",
      status: "active"
    });

    // ✅ Create Logs
    await CheckLog.create({
      passId: pass._id,
      status: "checked-in"
    });

    console.log("✅ Database Seeded Successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();