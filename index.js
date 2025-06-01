const express = require("express");
const cors = require("cors");
const app = express();

let ledStatus = "off";
let currentLocation = null; // Store the latest location

app.use(cors());
app.use(express.json());

// GET LED status
app.get("/status", (req, res) => {
  res.send(ledStatus);
});

// POST to toggle LED status
app.post("/toggle", (req, res) => {
  const { status } = req.body;
  if (status === "on" || status === "off") {
    ledStatus = status;
    return res.send("LED status changed to " + status);
  }
  res.status(400).send("Invalid status");
});

// ✅ NEW: POST to receive 'location' from frontend
app.post("/set-location", (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).send("Missing location");
  }

  currentLocation = location;
  console.log("Received location:", location);
  res.json({ message: `Location saved: ${location}` });
});

// ✅ NEW: GET to retrieve current location
app.get("/get-location", (req, res) => {
  if (currentLocation) {
    return res.json({ location: currentLocation });
  }
  res.status(404).json({ message: "No location set yet." });
});

// Root route
app.get("/", (req, res) => {
  res.send("ESP32 Backend is running.");
});

// Start server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
