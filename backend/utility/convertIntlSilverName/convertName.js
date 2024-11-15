const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Directories
const inputDir = path.resolve('./source');
const outputDir = path.resolve('./good');
const successDir = path.resolve('./success');

// Ensure directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}
if (!fs.existsSync(successDir)) {
  fs.mkdirSync(successDir);
}

// Function to get today's date in ddmmyy format
function getFormattedDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}

// Function to clean the filename prefix
function cleanFilename(filename) {
  // Remove special characters except underscores and hyphens
  filename = filename.replace(/[^a-zA-Z0-9_-]/g, '');

  // Remove double hyphens and anything after
  filename = filename.replace(/--.*$/, '');

  // Remove hyphens and dots
  filename = filename.replace(/[-.]/g, '');

  return filename;
}

// Process each .xlsx file in the input directory
fs.readdirSync(inputDir).forEach(file => {
  const filePath = path.join(inputDir, file);
  const fileExt = path.extname(file).toLowerCase();

  if (fileExt === '.xlsx') {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Unmerge cells I7:I11 if merged, and I12:I14 if merged
    const range1 = xlsx.utils.decode_range('I7:I11');
    const range2 = xlsx.utils.decode_range('I12:I14');
    if (worksheet['!merges']) {
      worksheet['!merges'] = worksheet['!merges'].filter(merge => {
        const start = merge.s;
        const end = merge.e;
        return !(
          (start.c === range1.s.c && start.r >= range1.s.r && end.r <= range1.e.r) ||
          (start.c === range2.s.c && start.r >= range2.s.r && end.r <= range2.e.r)
        );
      });
    }

    // Read the invoice number from cell I9 and the invoice date from cell I13
    const invoiceNumber = worksheet['I9'] ? worksheet['I9'].v.toString() : '';
    const invoiceDate = worksheet['I13'] ? worksheet['I13'].v : '';
    const formattedDate = getFormattedDate(new Date(invoiceDate));

    // Clean the filename and create the new name
    const oldFileName = path.parse(file).name;
    const cleanedFilename = cleanFilename(oldFileName);
    const newFileName = `${cleanedFilename}-${invoiceNumber}-${formattedDate}.xlsx`;

    // Copy the file to the output directory with the new name
    const outputFilePath = path.join(outputDir, newFileName);
    fs.copyFileSync(filePath, outputFilePath);

    // Move the original file to the success folder
    const successFilePath = path.join(successDir, file);
    fs.renameSync(filePath, successFilePath);

    console.log(`File copied to: ${outputFilePath} and moved to success folder.`);
  }
});
