import React, { useEffect, useState, useRef, useCallback} from 'react';
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Sample data for the invoice
const [totalAmount, setTotalAmount] = useState([0]);

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
    const doc = new PDFDocument({ margin: 50 });
    
    // Save the PDF to a file
    const writeStream = fs.createWriteStream('sampleInvoice.pdf');
    doc.pipe(writeStream);

    // Add customer details (first two lines)
    doc.fontSize(12)
       .text(`Customer Number: ${customerDetails.customerNumber}`, 50, 50)
       .text(`Customer Name: ${customerDetails.customerName}`, 50, 70)
       .text(`Full Address: ${customerDetails.fullAddress}`, 50, 90)
       .text(`Shipping Method: ${customerDetails.shippingMethod}`, 50, 110)
       .text(`Telephone: ${customerDetails.telephoneNumber}`, 50, 130);
    
    doc.moveDown(2);  // Add some space before line items

    // Line items header
    doc.fontSize(10);
    doc.text('SKU', 50, 160);
    doc.text('Quantity', 250, 160, { align: 'left' });
    doc.text('Price', 350, 160, { align: 'left' });
    doc.text('Total', 450, 160, { align: 'left' });
    doc.moveDown(0.5);
    doc.text('_______________________');
    doc.moveDown(0.5);

    // Loop through the line items
    let y = 190; // Start position for the line items
    let totalAmount = 0;
    lineItems.forEach((item) => {
        const itemTotal = item.quantity * item.price;
        setTotalAmount += itemTotal;

        // Add line item details on the same line
        doc.text(item.sku, 50, y);
        doc.text(item.quantity, 250, y);
        doc.text(`$${item.price.toFixed(2)}`, 350, y);
        doc.text(`$${itemTotal.toFixed(2)}`, 450, y);

        y += 20; // Move the y position for the next line item
    });

    // Total amount at the bottom
    doc.moveDown(2);
    doc.text('________________');
    doc.moveDown(0.5);
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
