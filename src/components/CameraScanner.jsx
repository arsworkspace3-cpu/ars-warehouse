import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function CameraScanner({ onScanSuccess, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear();
      },
      (error) => {}
    );

    return () => {
      scanner.clear().catch((err) => console.error("Scanner clear error", err));
    };
  }, [onScanSuccess]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "420px",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h3 style={{ margin: 0, color: "#0F172A" }}>📷 Scan Location QR</h3>
          <button
            onClick={onClose}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
        <div id="reader" style={{ width: "100%" }}></div>
      </div>
    </div>
  );
}