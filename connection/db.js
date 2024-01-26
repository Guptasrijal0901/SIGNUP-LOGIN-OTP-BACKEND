const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
     await mongoose.connect("mongodb://127.0.0.1:27017").then(() => {
      console.log("Database connected");
    });
  } catch (error) {
   console.error("Error connecting to the database:", error.message);
  }
};
module.exports =  connectDatabase ;

// const mongoose = require("mongoose");
// const connectDatabase = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/USER-INFO", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Database connected");
//   } catch (error) {
//     console.error("Error connecting to the database:", error.message);
//   }
// };
// module.exports = connectDatabase;

// const mongoose = require("mongoose");
// const connectDatabase = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/yourdatabasename");
//     console.log("Database connected");
//   } catch (error) {
//     console.error("Error connecting to the database:", error.message);
//   }
// };
// module.exports = connectDatabase;
