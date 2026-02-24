import { Printer, Download, X } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import Button from './Button';

/**
 * Thermal Receipt Component
 * Optimized for 58mm thermal printers
 */
export default function Receipt({ transaction, items, onClose, onPrint }) {
  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  const handleDownload = () => {
    let receiptText = `
================================
    ES COKLAT VARIAN RASA
================================

${formatDateTime(transaction.created_at)}
No: ${transaction.transaction_code}

--------------------------------
`;

    items.forEach((item) => {
      const productName = item.products?.name || item.name;
      const variant = item.products?.variant || item.variant;
      receiptText += `${productName} ${variant}
${item.qty} x ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)} = ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.subtotal)}
`;
    });

    receiptText += `
--------------------------------
TOTAL     ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.total)}
BAYAR     ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.paid)}
KEMBALI   ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.change)}

================================
    Terima Kasih! ❤️
================================
`;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `struk-${transaction.transaction_code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Receipt Preview */}
      <div className="bg-white rounded-xl p-6 font-mono text-sm max-w-sm mx-auto print-area">
        {/* Header */}
        <div className="text-center mb-4 pb-3 border-b-2 border-dashed border-gray-300">
          <h1 className="text-lg font-bold text-gray-900">ES COKLAT</h1>
          <p className="text-gray-600 text-xs">Varian Rasa</p>
          <p className="text-xs text-gray-500 mt-2">Jl. Contoh UMKM No.1</p>
          <p className="text-xs text-gray-500">Telp: 0812-3456-7890</p>
        </div>

        {/* Transaction Info */}
        <div className="mb-4 pb-3 border-b-2 border-dashed border-gray-300">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Tanggal</span>
            <span className="font-semibold">{formatDateTime(transaction.created_at)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-600">No. Transaksi</span>
            <span className="font-semibold">{transaction.transaction_code}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4 pb-3 border-b-2 border-dashed border-gray-300">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span>Menu</span>
            <span>Subtotal</span>
          </div>
          {items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold text-gray-900 text-xs">
                {item.products?.name || item.name} {item.products?.variant || item.variant}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                <span>{item.qty} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}</span>
                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1">
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Total</span>
            <span className="font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.total)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Bayar</span>
            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.paid)}</span>
          </div>
          <div className="flex justify-between text-gray-700 pt-2 border-t-2 border-dashed border-gray-300">
            <span className="font-bold">Kembalian</span>
            <span className="font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.change)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-3 border-t-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-medium">Terima Kasih!</p>
          <p className="text-xs text-gray-500">Sampai jumpa lagi! ❤️</p>
        </div>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="flex gap-2 no-print">
        <Button onClick={handlePrint} variant="secondary" className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Cetak
        </Button>
        <Button onClick={handleDownload} variant="secondary" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button onClick={onClose} variant="primary" className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Tutup
        </Button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm;
            background: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: 58mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
