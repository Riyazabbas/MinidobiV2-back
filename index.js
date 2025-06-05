const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
let ledStatus = "off";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Needed for ToyyibPay callback

// LED status
app.get("/status", (req, res) => {
  res.send(ledStatus);
});

// Create payment when "on" is requested
app.post("/toggle", async (req, res) => {
  const { status } = req.body;

  if (status === "on") {
    try {
      const response = await axios.post("https://dev.toyyibpay.com/index.php/api/createBill", null, {
        params: {
          userSecretKey: "xmgds3cq-ant6-mhc1-ohrw-ly2br3xlo3sb",
          categoryCode: "tx4dvsmz",
          billName: "Turn On LED",
          billDescription: "Payment to turn on LED",
          billPriceSetting: 1,
          billPayorInfo: 1,
          billAmount: 100, // in cents, RM1.00 = 100
          billReturnUrl: "https://majlisaqiqaharyan-arasy.my.canva.site/minidobi",
          billCallbackUrl: "https://minidobiv2-back-2.onrender.com/payment-callback",
          billExternalReferenceNo: "LED001",
          billTo: "Customer",
          billEmail: "test@example.com",
          billPhone: "0123456789"
        }
      });

      const billCode = response.data[0].BillCode;
      const paymentUrl = `https://dev.toyyibpay.com/${billCode}`;
      res.send({ url: paymentUrl });

    } catch (err) {
      console.error("Payment error:", err);
      res.status(500).send("Failed to initiate payment");
    }

  } else if (status === "off") {
    ledStatus = "off";
    res.send("LED status changed to off");
  } else {
    res.status(400).send("Invalid status");
  }
});

// Callback endpoint ToyyibPay calls upon successful payment
app.post("/payment-callback", (req, res) => {
  const { status_id } = req.body;

  if (status_id === "1") {
    ledStatus = "on";
    console.log("Payment successful. LED turned ON.");
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("ESP32 Backend is running.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
