
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import React, { useState } from 'react';

const InvoiceGenerator = () => {
  // Set initial state for customer details and line items
  const [customerDetails, setCustomerDetails] = useState({
    customerNumber: 'C12345',
    customerName: 'John Doe',
    fullAddress: '1234 Elm Street, Springfield, IL, 62701',
    shippingMethod: 'FedEx Express',
    telephoneNumber: '(555) 123-4567',
  });

  const [lineItems, setLineItems] = useState([
    { description: 'Item 1', quantity: 2, price: 49.99 },
    { description: 'Item 2', quantity: 1, price: 19.99 },
    { description: 'Item 3', quantity: 4, price: 9.99 },
  ]);

  const generateInvoicePDF = () => {
    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());

    // Add customer details
    doc.fontSize(12).text(`Customer Number: ${customerDetails.customerNumber}`, 50, 50);
    doc.fontSize(9).text(`Customer Name: ${customerDetails.customerName}`, 50, 70);
    doc.fontSize(9).text(`Full Address: ${customerDetails.fullAddress}`, 50, 90);
    doc.fontSize(9).text(`Shipping Method: ${customerDetails.shippingMethod}`, 50, 110);
    doc.fontSize(9).text(`Telephone: ${customerDetails.telephoneNumber}`, 50, 130);

    doc.moveDown(1.5);

    // Line items header
    doc.fontSize(10).text('Description', 50, 160);
    doc.fontSize(10).text('Quantity', 250, 160, { align: 'left' });
    doc.fontSize(10).text('Price', 350, 160, { align: 'left' });
    doc.fontSize(10).text('Total', 450, 160, { align: 'left' });
    doc.moveDown(0.5);
    doc.text('-------------------------------------------------------------');
    doc.moveDown(0.5);

    // Line items
    let y = 190;
    let totalAmount = 0;

    lineItems.forEach((item) => {
      const itemTotal = item.quantity * item.price;
      totalAmount += itemTotal;

      doc.fontSize(10).text(item.description, 50, y);
      doc.fontSize(10).text(item.quantity, 250, y);
      doc.fontSize(10).text(`$${item.price.toFixed(2)}`, 350, y);
      doc.fontSize(10).text(`$${itemTotal.toFixed(2)}`, 450, y);

      y += 20;  // Move to next line
    });

    doc.moveDown(2);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, { align: 'right' });

    // Finalize PDF file and trigger download
    doc.end();

    // Stream to blob and download
    stream.on('finish', () => {
      const url = stream.toBlobURL('application/pdf');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sampleInvoice.pdf';
      a.click();
    });
  };

  return (
    <div>
      <h1>Invoice Generator</h1>
      <button onClick={generateInvoicePDF}>Generate Invoice PDF</button>
    </div>
  );
};

export default InvoiceGenerator;
