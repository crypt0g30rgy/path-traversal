const fs = require('fs');
const path = require('path');

const getPdfFile = async (req, res) => {
  try {
    const { filename } = req.query;

    console.log('[+] Incoming request');
    console.log('[+] Raw filename parameter:', filename);

    if (!filename) {
      console.log('[-] No filename provided');
      return res.status(400).json({ error: "Missing PDF filename." });
    }

    /*
      🚨 VULNERABILITY INTENTIONALLY INTRODUCED 🚨
      - No validation
      - No sanitization
      - Absolute paths allowed
      - Relative traversal allowed
    */

    // const pdfPath = path.join(__dirname, 'pdfs', filename);

    /*
      Work Around for nodejs path absolute traversal 
    */

    const pdfPath = filename.startsWith('/')
  ? filename
  : path.join(__dirname, 'pdfs', filename);

    console.log('[+] Constructed file path:', pdfPath);

    if (!fs.existsSync(pdfPath)) {
      console.log('[-] File does not exist:', pdfPath);
      return res.status(404).json({ error: "PDF file not found." });
    }

    console.log('[+] File exists, streaming:', pdfPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${path.basename(filename)}`
    );

    const fileStream = fs.createReadStream(pdfPath);

    fileStream.on('error', (err) => {
      console.error('[-] File stream error:', err);
      res.status(500).end();
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('[!] Unexpected error:', error);

    if (
      error.message &&
      error.message.includes('Zen has blocked a path traversal attack:')
    ) {
      console.error('[!] Blocked by Zen Security');
      return res.status(403).json({ error: "Blocked by Security." });
    }

    res.status(500).json({ error: "Error fetching the PDF file." });
  }
};

module.exports = { getPdfFile };