const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Route to read data from CSV and send it to the frontend with filters
router.get("/data", (req, res) => {
  const results = [];
  const { ageRange, gender, startDate, endDate } = req.query; // Get filters from query parameters

  const filePath = path.join(__dirname, "..", "data", "data.csv"); // Adjust path as necessary

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      const age = parseInt(data.Age, 10); // Assuming 'Age' is in the column named 'Age'
      const day = new Date(data.Day); // Assuming 'Day' is in a date format

      // Check if the current record passes the filters
      let passesFilter = true;

      // Filter by age range
      if (ageRange) {
        const [minAge, maxAge] = ageRange.split("-").map(Number);
        passesFilter =
          passesFilter &&
          (minAge !== undefined ? age >= minAge : true) &&
          (maxAge !== undefined ? age <= maxAge : true);
      }

      // Filter by gender
      if (gender) {
        passesFilter =
          passesFilter && data.Gender.toLowerCase() === gender.toLowerCase();
      }

      // Filter by date range
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        passesFilter = passesFilter && day >= start && day <= end;
      }

      // If passes all filters, add to results
      if (passesFilter) {
        results.push(data);
      }
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (err) => {
      console.error("Error reading CSV file:", err);
      res.status(500).send("Error reading CSV file");
    });
});

module.exports = router;
