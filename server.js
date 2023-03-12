const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

app.listen(4000, (req, res) => {
  console.log(`Running Server on port 4000`);
});
