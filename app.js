require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const connect = require("./lib/connect");
const User = require("./models/User");
const Author = require("./models/Author");
const Book = require("./models/Book");

// default catch-all handler
// app.get("*", (request, response) => {
//   response.status(404).json({ message: "Route not defined" });
// });

app.get("/", async (req, res) => {
  await connect();
  const users = await User.find();

  if (!notes.length) {
    return res.json({ message: "Users not found" });
  }

  // return res.json(notes.map((note) => ({ ...note._doc, id: note._id })));
  return res.json(users);
});

const server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
