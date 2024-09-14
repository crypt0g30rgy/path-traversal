const fs = require('fs');
const path = require('path');

const getPdfFile = async (req, res) => {
  try {
    // Extract PDF filename from the request (e.g., passed as a query or route parameter)
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "Missing PDF filename." });
    }

    // Construct the file path
    const pdfPath = path.join(__dirname, 'pdfs', filename);

    // Check if the file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found." });
    }

    // Set headers to indicate file is a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Stream the PDF file to the response
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

  } catch (error) {

    // Check if the error is due to Aikido's protection
    if (error.message && error.message.includes('Aikido firewall has blocked')) {
      console.error('Blocked by Aikido Security:', error.message);
      return res.status(403).json({ error: "Blocked by Security." });
  }

  // Log and return a 500 error for all other errors
    console.error("Error returning PDF file:", error);
    res.status(500).json({ error: "Error fetching the PDF file." });
  }
};

module.exports = { getPdfFile }