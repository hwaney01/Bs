
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
            body { font-family: 'Cairo', 'Courier New', monospace; direction: rtl; margin: 0; padding: 10px; color: #000; background-color:#fff; }
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
        <h1>إدارة خدمات الصيانة</h1>
        <p>إيصال صيانة</p>
        <hr />
        <p><span className="bold">معرف المهمة:</span> {record.id}</p>
        <p><span className="bold">التاريخ:</span> {new Date(record.dateTime).toLocaleString('ar-EG')}</p>
        <p><span className="bold">الموظف:</span> {record.employee}</p>
        <hr />
        <p><span className="bold">العميل:</span> {record.customerName}</p>
        <p><span className="bold">الهاتف:</span> {record.phone}</p>
        <hr />
        <p className="bold">وصف العطل:</p>
        <p>{record.faultDescription}</p>
        <hr />
        <div className="item">
          <p className="bold">التكلفة التقديرية:</p>
          <p className="bold">${record.estimatedCost.toFixed(2)}</p>
        </div>
        <hr />
        <p style={{ textAlign: 'center', marginTop: '10px' }}>شكراً لتعاملكم معنا!</p>
      </div>
    </div>
  );
};

export default PrintReceipt;
