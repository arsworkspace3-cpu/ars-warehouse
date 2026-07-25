import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

export function generateA4BarcodePDF(productName, totalQty, batchNumber) {
  const doc = new jsPDF("p", "mm", "a4");

  const prefix = productName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase() || "PRD";

  const rows = 10;
  const cols = 4;
  const barcodeWidth = 44;
  const barcodeHeight = 22;
  const startX = 10;
  const startY = 12;
  const xPadding = 4;
  const yPadding = 5;

  for (let i = 1; i <= totalQty; i++) {
    const barcodeText = `${prefix}-${String(i).padStart(6, "0")}`;
    const indexOnPage = (i - 1) % (rows * cols);

    if (i > 1 && indexOnPage === 0) {
      doc.addPage();
    }

    const col = indexOnPage % cols;
    const row = Math.floor(indexOnPage / cols);

    const x = startX + col * (barcodeWidth + xPadding);
    const y = startY + row * (barcodeHeight + yPadding);

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, barcodeText, {
      format: "CODE128",
      width: 1.5,
      height: 40,
      displayValue: true,
      fontSize: 10,
      margin: 2,
    });

    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", x, y, barcodeWidth, barcodeHeight);
  }

  doc.save(`${prefix}_Batch_${batchNumber}_Barcodes.pdf`);
}