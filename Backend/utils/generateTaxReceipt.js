// utils/generateTaxReceipt.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateTaxReceipt = (tax) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `tax-receipt-${tax._id}.pdf`;
    const filePath = path.join("uploads/receipts", fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("Land Tax Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Tax Year: ${tax.taxYear}`);
    doc.text(`Land ID: ${tax.landId.landId}`);
    doc.text(`Owner: ${tax.landId.owner.name}`);
    doc.text(`Total Tax Paid: NPR ${tax.totalTax}`);
    doc.text(`Payment Date: ${tax.paidAt}`);

    doc.end();

    resolve(`/uploads/receipts/${fileName}`);
  });
};

export default generateTaxReceipt;
