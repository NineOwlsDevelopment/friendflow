const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.set("strict", true);
mongoose.set("runValidators", true);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch((e) => {
    console.log(e);
  });
