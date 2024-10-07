const PDFDocument = require('pdfkit');
const fs = require('fs');

// Sample data for the invoice
const customerDetails = {
    customerNumber: 'C12345',
    customerName: 'John Doe',
    fullAddress: '1234 Elm Street, Springfield, IL, 62701',
    shippingMethod: 'FedEx Express',
    telephoneNumber: '(555) 123-4567',
};

const lineItems = [
    { sku: 'BNUV-A28000', quantity: 2, price: 49.99 },
    { sku: 'BNTS-F06A12', quantity: 1, price: 19.99 },
    { sku: 'BNTG-F06A07', quantity: 4, price: 9.99 },
];

// Function to generate the invoice PDF
function createInvoice(customerDetails, lineItems) {
    const doc = new PDFDocument({ margin: 20 });
    
    // Save the PDF to a file
    const writeStream = fs.createWriteStream('sampleInvoice.pdf');
    doc.pipe(writeStream);

    // Add customer details (first two lines)
    doc.fontSize(12).text(`Customer Number: ${customerDetails.customerNumber}`, { align: 'left' });
    doc.text(`Customer Name: ${customerDetails.customerName}`, { align: 'left' });
    doc.fontSize(10).text(`Full Address: ${customerDetails.fullAddress}`, { align: 'left' });
    doc.text(`Shipping Method: ${customerDetails.shippingMethod}`, { align: 'left' });
    doc.text(`Telephone: ${customerDetails.telephoneNumber}`, { align: 'left' });
    doc.moveDown(2);  // Add some space before line items

    // Line items header
    doc.fontSize(10).text('SKU', 20, doc.y);
    doc.text('Quantity', 40, doc.y, { align: 'left' });
    doc.text('Price', 60, doc.y, { align: 'left' });
    doc.text('Total', 80, doc.y, { align: 'left' });
    doc.moveDown(0.5);
    doc.text('-------------------------------------------------------------');
    doc.moveDown(0.5);

    // Loop through the line items
    let totalAmount = 0;
    lineItems.forEach((item) => {
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;

        doc.text(item.sku, 20, doc.y);
        doc.text(item.quantity, 40, doc.y, { align: 'left' });
        doc.text(`$${item.price.toFixed(2)}`, 60, doc.y, { align: 'left' });
        doc.text(`$${itemTotal.toFixed(2)}`, 80, doc.y, { align: 'left' });
        doc.moveDown(1);
    });

    // Total amount at the bottom
    doc.moveDown(2);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, { align: 'right' });

    // Finalize the PDF and end the stream
    doc.end();

    // Confirm the file is saved
    writeStream.on('finish', () => {
        console.log('PDF generated successfully.');
    });
}

// Call the function to generate the invoice
createInvoice(customerDetails, lineItems);
