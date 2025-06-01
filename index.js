const express = require("express");
const cors = require("cors");
const app = express();
let ledStatus = "off";

app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => {
  res.send(ledStatus);
});

app.post("/toggle", (req, res) => {
  const { status } = req.body;
  if (status === "on" || status === "off") {
    ledStatus = status;
    return res.send("LED status changed to " + status);
  }
  res.status(400).send("Invalid status");
});

app.get("/", (req, res) => {
  res.send("ESP32 Backend is running.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
