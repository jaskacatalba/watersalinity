// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

//
// ── PROMETHEUS METRICS SETUP ────────────────────────────────────────────────
//
const client = require("prom-client");
// collectDefaultMetrics will gather CPU, memory, and event‐loop metrics
client.collectDefaultMetrics();

// Optional: create a custom counter for HTTP requests
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

//
// ── EXPRESS SETUP ────────────────────────────────────────────────────────────
//
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ── METRICS ENDPOINT ────────────────────────────────────────────────────────
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ── MIDDLEWARE TO COUNT REQUESTS ────────────────────────────────────────────
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

//
// ── YOUR EXISTING ROUTES ────────────────────────────────────────────────────
//
const sensorRoutes = require("./routes/sensorRoutes");
const authRoutes = require("./routes/authRoutes");
const municipalityRoutes = require("./routes/municipalities");
const locationRoutes = require("./routes/locationRoutes");
const contaminatedWellsRoutes = require("./routes/contaminatedWellsRoutes");
const unownedWellsCleanRoutes = require("./routes/unownedWellsCleanRoutes");
const contaminatedWellsUnownedRoutes = require("./routes/contaminatedWellsUnownedRoutes");
const wellRoutes = require("./routes/wellRoutes");
const sendRegistrationEmail = require("./utils/mailer");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/sensors", sensorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", municipalityRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/contaminated-wells", contaminatedWellsRoutes);
app.use("/api/unowned-wells-clean", unownedWellsCleanRoutes);
app.use("/api/contaminated-wells-unowned", contaminatedWellsUnownedRoutes);
app.use("/api/wells", wellRoutes);

app.post("/api/send-email", async (req, res) => {
  const { recipientEmail, userName } = req.body;
  try {
    await sendRegistrationEmail(recipientEmail, userName);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
