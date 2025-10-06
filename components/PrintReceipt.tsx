
import React, { useEffect, useRef } from 'react';
import { ServiceRecord } from '../types';

interface PrintReceiptProps {
  record: ServiceRecord;
  onDone: () => void;
}

const PrintReceipt: React.FC<PrintReceiptProps> = ({ record, onDone }) => {
  const printContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const print = () => {
        const content = printContentRef.current;
        if (!content) return;
        
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) {
            alert("Could not open print window. Please disable your pop-up blocker.");
            onDone();
            return;
        }

        printWindow.document.write('<html><head><title>Print Receipt</title>');
        printWindow.document.write(`
          <style>
            body { font-family: 'Courier New', monospace; margin: 0; padding: 10px; color: #000; background-color:#fff; }
            .receipt { width: 80mm; padding: 5mm; box-sizing: border-box; }
            h1 { font-size: 1.2em; text-align: center; margin: 0 0 10px 0; }
            p { margin: 2px 0; font-size: 0.9em; }
            hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
          </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(content.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        onDone();
    };

    // Delay printing slightly to ensure content is rendered
    const timer = setTimeout(print, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, onDone]);

  return (
    <div ref={printContentRef} style={{ display: 'none' }}>
      <div className="receipt">
        <h1>Service Desk Pro</h1>
        <p>Repair Receipt</p>
        <hr />
        <p><span className="bold">Job ID:</span> {record.id}</p>
        <p><span className="bold">Date:</span> {new Date(record.dateTime).toLocaleString()}</p>
        <p><span className="bold">Employee:</span> {record.employee}</p>
        <hr />
        <p><span className="bold">Customer:</span> {record.customerName}</p>
        <p><span className="bold">Phone:</span> {record.phone}</p>
        <hr />
        <p className="bold">Fault Description:</p>
        <p>{record.faultDescription}</p>
        <hr />
        <div className="item">
          <p className="bold">Estimated Cost:</p>
          <p className="bold">${record.estimatedCost.toFixed(2)}</p>
        </div>
        <hr />
        <p style={{ textAlign: 'center', marginTop: '10px' }}>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default PrintReceipt;
