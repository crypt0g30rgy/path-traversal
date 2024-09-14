const express = require("express");
const router = express.Router();

const { getRoot } = require("../controllers/index");
const { getPdfFile } = require("../controllers/fetchPDF");


//Get Root

/**
 * @swagger
 * tags:
 *   name: Root
 *   description: the Root
 * /:
 *   get:
 *     summary: Return the Root Message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Root Message
 */

router.get("/", getRoot)

/**
 * @swagger
 * tags:
 *   name: PDF
 *   description: PDF generation and retrieval
 * /v1/getPdf:
 *   get:
 *     summary: Retrieve a PDF file
 *     tags: [PDF]
 *     parameters:
 *       - in: query
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the PDF file to retrieve
 *     responses:
 *       200:
 *         description: PDF file successfully retrieved
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing or invalid PDF filename
 *       404:
 *         description: PDF file not found
 *       500:
 *         description: Server error when fetching the PDF
 */

router.get("/v1/getPdf", getPdfFile)

module.exports = router;