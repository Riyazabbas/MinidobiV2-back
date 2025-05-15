const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let ledStatus = false;
let lightReading = 0;

// Toggle LED
app.post("/toggle", (req, res) => {
  const { status } = req.body;
  if (typeof status === "boolean") {
    ledStatus = status;
    res.json({ message: "LED status updated" });
  } else {
    res.status(400).send("Invalid data");
  }
});

// Get LED status
app.get("/status", (req, res) => {
  res.json({ status: ledStatus });
});

// Receive light reading
app.post("/light", (req, res) => {
  const { value } = req.body;
  if (typeof value === "number") {
    lightReading = value;
    res.send("Light reading updated");
  } else {
    res.status(400).send("Invalid light data");
  }
});

// Return light reading
app.get("/light", (req, res) => {
  res.json({ value: lightReading });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
