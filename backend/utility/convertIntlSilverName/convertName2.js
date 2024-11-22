const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

// Define directories
const inputDir = path.resolve("./source");
const outputDir = path.resolve("./good");
const successDir = path.resolve("./success");

// Ensure the output and success directories exist
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
if (!fs.existsSync(successDir)) fs.mkdirSync(successDir);

// Helper function to clean filenames
function cleanFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9_-]/g, "") // Remove special characters
    .replace(/--.*$/, "") // Remove double hyphens and anything that follows
    .replace(/[-.]/g, ""); // Remove hyphens and dots
}

// Helper function to format dates into `ddmmyy`
function formatDate(value) {
  if (!value) return "000000";

  // If it's a Date object
  if (value instanceof Date) {
    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JS
    const year = String(value.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  }

  // If it's a string like "15-Oct-23"
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date)) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${day}${month}${year}`;
    }
  }

  // If it's an unrecognized format, return a placeholder
  return "000000";
}

// Process Excel files
async function processFiles() {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    if (path.extname(file).toLowerCase() === ".xlsx") {
      const filePath = path.join(inputDir, file);
      const workbook = new ExcelJS.Workbook();

      try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0]; // Assuming the first sheet

        // Unmerge cells and extract values
        if (worksheet.getCell("I10").isMerged) worksheet.unMergeCells("I7:I11");
        const invoiceNumber = worksheet.getCell("I9").value || "Unknown";

        if (worksheet.getCell("I14").isMerged) worksheet.unMergeCells("I12:I14");
        const rawDate = worksheet.getCell("I13").value;
        const formattedDate = formatDate(rawDate);

        // Clean filename and create new name
        const oldFileName = path.parse(file).name;
        const cleanedFilename = cleanFilename(oldFileName);
        const newFileName = `${cleanedFilename}-${invoiceNumber}-${formattedDate}.xlsx`;

        // Copy the file with the new name
        const newFilePath = path.join(outputDir, newFileName);
        await workbook.xlsx.writeFile(newFilePath);

        // Move the original file to the success folder
        fs.renameSync(filePath, path.join(successDir, file));

        console.log(`Processed: ${newFileName}`);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
      }
    }
  }
}

processFiles()
  .then(() => console.log("File processing complete."))
  .catch((err) => console.error("Error:", err.message));
