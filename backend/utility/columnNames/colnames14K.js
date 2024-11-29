{/*
ensure node has the following installed. from terminal:
npm install xlsx fs-extra
several steps, including handling file operations, parsing Excel files, and managing logging.
Running the node from terminal.

node colnames13.js [optional_invoice_tab]

FILENAME: ..\prod\colnames14.js
by: Howard Tierra
FORMAT: Node.js
LOCATION: /home/howardt/MernStart/_utils/columnNames/colnames14.js

DESCRIPTION:

**** This is SKU version post April 15 2024 where the Invoice, and rep column is on column K.

Read and store the contents of column names 2 rows after after row "QTY"
Includes rep and customername

        1           2         3            4       5         6           7             8             9
        QTY         PRODUCTS  OLD CODE     SKU     OPTION1   OPTION2     DESCRIPTION   PRICE EACH    AMOUNT
                                                                                                     TOTAL
                                        

        Qty	        Products	                   Option 1	 Option 2	 Description   Price each	Amount          #web/e-mail
        Qty         Products 	                   Options 	             Description   Price USD 	Amount          #web/e-mail
        Qty         Products 	                   Options 	             Description   Price each 	Amount          #web/e-mail
        Qty         Products                       Options               Description   Price each 	Amount          #walk-in
        Qty         Products 	                   Options	             Description   Price each 	Amount          #walk-in

IF uc($column_name_value) contains   store current column to       store $column_value to        
QTY || QUANTITY                      $col[1]                       $qty_col_val    
PRODUCTS                             $col[2]                       $product_col_val
OLD CODE                             $col[3]                       $old_col_val
OPTION 1 || OPTIONS                  $col[4]                       $option1_col_val
OPTION 2                             $col[5]                       $option2_col_val,
DESCRIPTION                          $col[6]                       $description_col_val,
PRICE                                $col[7]                       $price_col_val
AMOUJNT || TOTAL                     $col[8]                       $amt_col_val


*/}

const fs = require('fs-extra');
const path = require('path');
const xlsx = require('xlsx');
const moment = require('moment');

// Get command line arguments
const invoicetab = process.argv[2] || "Invoice";
const scriptname = "This script: colnames14K.js";
const start_time = moment().format('MMMM Do YYYY, h:mm:ss a');
const datetime = moment().format('MM-DD-YY_HH_mm_ss');
let fin_time;

// Define directories
const sourcedir = "./sourceK";
const goodDir = "./goodK";
const badDir = "./badK";

// Create log and data files
const logFilePath = `./logcolnames14K_${datetime}.txt`;
const dataFilePath = `./colnames14K_${datetime}.tsv`;

//define sheet vars
const rowIndex = 0;

fs.appendFileSync(logFilePath, `You have processing files in this directory\n`);
fs.appendFileSync(logFilePath, `START TIME: ${start_time}\n`);
console.log(`Source directory: ${sourcedir}`);

async function main() {
    const files = await fs.readdir(sourcedir);
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
    const totalElements = xlsxFiles.length;

    console.log(`You have ${totalElements} files going on in this directory`);
    fs.appendFileSync(logFilePath, `You have ${totalElements} files going on in this directory\n`);

    for (let i = 0; i < totalElements; i++) {
        const filename = xlsxFiles[i];
        const sourcename = path.join(sourcedir, filename);
        const relocdir = path.join(badDir, filename);
        const gooddir = path.join(goodDir, filename);

        console.log(`Now doing: ${sourcename}`);
        let invoiceNumber;
        let orderDate;

        // Remove .xlsx extension
        const baseFilename = path.basename(filename, '.xlsx');
        const resultHeaders = baseFilename.split('-');

        if (resultHeaders.length < 2) {
            errorOut(`Fail: Incorrect filename format for ${filename}`);
            await fs.move(sourcename, relocdir);
            continue;
        }

        // Extract invoice number and order date
        invoiceNumber = resultHeaders[resultHeaders.length - 2];
        orderDate = resultHeaders[resultHeaders.length - 1];

        // Validate order date format
        if (/^\d{6}$/.test(orderDate)) {
            orderDate = orderDate.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3'); // Convert to mm-dd-yy format
            console.log("Order date is good.");
        } else {
            errorOut(`Fail: ${invoiceNumber} Incorrect Order date format`);
            await fs.move(sourcename, relocdir);
            continue;
        }

        // Read the Excel file
        const workbook = xlsx.readFile(sourcename);
        const worksheet = workbook.Sheets[invoicetab];

        if (!worksheet) {
            errorOut(`Fail: ${sourcename}. Invoice worksheet does not exist`);
            await fs.move(sourcename, relocdir);
            continue;
        }

        // Read values from specific cells
        const rep = worksheet['J17']?.v || ""; // Get Rep from cell J17
        const customerName = worksheet['B10']?.v || ""; // Get Buyer from cell B10

        // Find headers and process data
        let headersFound = false;
        let qtyCol, productCol, oldcodeCol, skuCol;

        for (let rowIndex = 0; rowIndex < 100; rowIndex++) { // Assuming max 100 rows for header search
            const qtyCellValue = worksheet[`B${rowIndex + 1}`]?.v; // Assuming QTY is in column B

            if (qtyCellValue && /QTY|QUANTITY/i.test(qtyCellValue)) {
                qtyCol = 'B';
                headersFound = true;
                console.log(`Found: ${qtyCellValue} on row ${rowIndex + 1}`);
                break;
            }
        }

        if (!headersFound) {
            errorOut("QTY header not found");
            await fs.move(sourcename, relocdir);
            continue;
        }

        // Process data rows after headers
        const dataRowsStartIndex = rowIndex + 1; // Assuming data starts from the next row after headers
        const dataRowsEndIndex = worksheet['!ref'].split(':')[1].replace(/[^\d]/g, ''); // Get last row number

        for (let rowIndex = dataRowsStartIndex; rowIndex <= dataRowsEndIndex; rowIndex++) {
            const qtyValue = worksheet[`B${rowIndex}`]?.v; // Get quantity value from column B

            if (!qtyValue || !/^\d+$/.test(qtyValue)) continue; // Skip if no valid quantity

            let lineArray = [
                invoiceNumber,
                orderDate,
                rep,
                customerName,
                qtyValue,
                worksheet[`C${rowIndex}`]?.v || "", // Product column C
                worksheet[`D${rowIndex}`]?.v || "", // Old Code column D
                worksheet[`E${rowIndex}`]?.v || "", // SKU column E
                worksheet[`F${rowIndex}`]?.v || "", // Option1 column F
                worksheet[`G${rowIndex}`]?.v || "", // Option2 column G
                worksheet[`H${rowIndex}`]?.v || "", // Description column H
                worksheet[`I${rowIndex}`]?.v || "", // Price column I
                worksheet[`J${rowIndex}`]?.v || ""  // Amount column J
            ];

            console.log(lineArray.join('\t'));
            fs.appendFileSync(dataFilePath, lineArray.join('\t') + '\n');
        }

        await fs.move(sourcename, gooddir);
    }

    fin_time = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log(`FINISH TIME: ${fin_time}`);
    fs.appendFileSync(logFilePath, `FINISH TIME: ${fin_time}\n`);
}

function errorOut(errorNote) {
    console.error(errorNote);
    fs.appendFileSync(logFilePath, `${errorNote}\n`);
}

// Run the main function
main().catch(console.error);