import React, { useEffect, useRef } from 'react';
import { ServiceRecord, WorkStatus } from '../types';

interface PrintReceiptProps {
  record: ServiceRecord;
  onDone: () => void;
}

const PrintReceipt: React.FC<PrintReceiptProps> = ({ record, onDone }) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  
  const isFinalInvoice = record.workStatus === WorkStatus.REPAIRED_AND_DELIVERED && record.finalTotalCost !== undefined;
  const title = isFinalInvoice ? 'فاتورة نهائية' : 'إيصال استلام للصيانة';


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
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
            body { font-family: 'Cairo', sans-serif; direction: rtl; margin: 0; padding: 10px; color: #000; background-color:#fff; }
            .receipt { width: 80mm; padding: 5mm; box-sizing: border-box; }
            h1 { font-size: 1.2em; text-align: center; margin: 0 0 10px 0; }
            h2 { font-size: 1em; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 3px;}
            p { margin: 3px 0; font-size: 0.9em; line-height: 1.4; }
            hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; }
            .item-product { display: grid; grid-template-columns: 1fr auto auto; gap: 5px; align-items: center; margin-bottom: 2px;}
            .bold { font-weight: bold; }
            .pre-wrap { white-space: pre-wrap; word-wrap: break-word; }
            .total { font-size: 1.1em; font-weight: bold; }
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

    const timer = setTimeout(print, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, onDone]);

  return (
    <div ref={printContentRef} style={{ display: 'none' }}>
      <div className="receipt">
        <h1>براء ستور</h1>
        <p style={{textAlign: 'center', fontWeight: 'bold'}}>{title}</p>
        <hr />
        <p><span className="bold">معرف المهمة:</span> {record.id}</p>
        {isFinalInvoice && record.finalInvoiceNumber && <p><span className="bold">رقم الفاتورة:</span> {record.finalInvoiceNumber}</p>}
        <p><span className="bold">التاريخ:</span> {new Date(record.dateTime).toLocaleString('ar-EG')}</p>
        <p><span className="bold">الموظف:</span> {record.employee}</p>
        
        <h2>بيانات العميل والجهاز</h2>
        <p><span className="bold">العميل:</span> {record.contactName}</p>
        <p><span className="bold">الهاتف:</span> {record.contactPhone}</p>
        <p><span className="bold">الجهاز:</span> {record.deviceType} - {record.deviceModel}</p>
        <p><span className="bold">الرقم التسلسلي:</span> {record.serialNumber}</p>
        
        <h2>وصف العطل والحالة</h2>
        <p className="bold">حالة الجهاز عند الاستلام:</p>
        <p className="pre-wrap">{record.deviceStatus}</p>
        <p className="bold">وصف العطل:</p>
        <p className="pre-wrap">{record.faultDescription}</p>
        
        <hr />
        
        {isFinalInvoice ? (
            <div>
                <h2>تفاصيل الفاتورة</h2>
                <div className="item">
                    <p>تكلفة العمل النهائية:</p>
                    <p className="bold">{(record.finalLaborCost || 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                </div>
                {(record.usedProducts && record.usedProducts.length > 0) && (
                    <div style={{marginTop: '5px'}}>
                        <p className="bold">القطع والخدمات:</p>
                        {record.usedProducts.map(p => (
                            <div key={p.productId} className="item-product">
                                <span>{p.name} {p.type === 'Service' ? '(خدمة)' : (p.hasWarranty ? '(ضمان)' : '')}</span>
                                <span>x{p.quantity}</span>
                                <span className="bold">{(p.salePrice * p.quantity).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                            </div>
                        ))}
                    </div>
                )}
                <hr/>
                <div className="item total">
                    <p>الإجمالي المطلوب:</p>
                    <p>{(record.finalTotalCost || 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                </div>
            </div>
        ) : (
             <div>
                <h2>التكلفة المبدئية</h2>
                <div className="item">
                  <p className="bold">تكلفة العمل التقديرية:</p>
                  <p className="bold">{(record.estimatedLaborCost).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                </div>
             </div>
        )}
        
        {record.warranty && isFinalInvoice && (
            <div>
                <hr />
                <h2>تفاصيل الضمان</h2>
                <p><span className="bold">نوع الضمان:</span> {record.warranty.name}</p>
                <p><span className="bold">المدة:</span> {record.warranty.durationMonths} أشهر</p>
                <p className="bold">الشروط:</p>
                <p className="pre-wrap">{record.warranty.description}</p>
            </div>
        )}

        <hr />
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8em' }}>
            {isFinalInvoice
              ? 'نشكركم على ثقتكم في خدماتنا. يرجى مراجعة الفاتورة.'
              : 'هذا الإيصال هو سند استلام للجهاز المذكور أعلاه بالحالة الموضحة. التكلفة المذكورة هي تقدير أولي للعمل فقط وقد تتغير.'
            }
        </p>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>شكراً لتعاملكم معنا!</p>
      </div>
    </div>
  );
};

export default PrintReceipt;
