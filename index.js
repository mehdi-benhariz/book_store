const express = require("express");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const PORT = process.env.PORT || 3000;

require("./config")(app);
require("./database").init();

app.post("/add", (req, res) => {
  console.log(req.body);
  res.send("Hello World!");
});
app.use("/api/v1/auth", require("./routers/authRoute"));

app.listen(PORT, () => {
  console.log("App listening on port 3000!");
});
