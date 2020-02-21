const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("config");
const mongoose = require("mongoose");
const PORT = config.get("port") || process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", require("./routes/messenger"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();
