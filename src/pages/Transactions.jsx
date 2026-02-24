import { useState, useEffect } from 'react';
import { Search, Calendar, FileText, Eye } from 'lucide-react';
import { getTransactions, getTransactionById } from '../services/supabase';
import { Card, Modal, Receipt, Button, LoadingSpinner } from '../components';
import { formatRupiah, formatDateTime } from '../utils/helpers';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, startDate, endDate]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await getTransactions();
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.transaction_code.toLowerCase().includes(query) ||
          t.user_profiles?.full_name?.toLowerCase().includes(query)
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (t) => new Date(t.created_at) <= endDateObj
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleViewDetail = async (transactionId) => {
    try {
      const data = await getTransactionById(transactionId);
      setSelectedTransaction(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading transaction detail:', error);
    }
  };

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        <Card className="p-4">
          <p className="text-sm text-white/60">Total Transaksi</p>
          <p className="text-2xl font-bold text-white mt-1">{filteredTransactions.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-white/60">Total Pendapatan</p>
          <p className="text-2xl font-bold text-cream-300 mt-1">{formatRupiah(totalRevenue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-white/60">Rata-rata</p>
          <p className="text-xl font-bold text-white mt-1">
            {formatRupiah(filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0)}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mx-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Cari no. transaksi / kasir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glass w-full pl-12 pr-4 py-3"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-glass w-full pl-12 pr-4 py-3"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-glass w-full pl-12 pr-4 py-3"
            />
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="px-4 space-y-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="p-4 cursor-pointer hover:bg-white/15"
              onClick={() => handleViewDetail(transaction.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cream-300" />
                    <p className="font-semibold text-white truncate">
                      {transaction.transaction_code}
                    </p>
                  </div>
                  <p className="text-sm text-white/60 mt-1">
                    {formatDateTime(transaction.created_at)}
                  </p>
                  <p className="text-sm text-white/50 mt-0.5">
                    Kasir: {transaction.user_profiles?.full_name || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-cream-300">
                    {formatRupiah(transaction.total)}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Bayar: {formatRupiah(transaction.paid)}
                  </p>
                  <p className="text-xs text-green-400 mt-0.5">
                    Kembali: {formatRupiah(transaction.change)}
                  </p>
                  <button className="mt-2 text-xs text-cream-300 hover:text-white flex items-center gap-1 ml-auto">
                    <Eye className="w-3 h-3" />
                    Detail
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-white/40">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p>Belum ada transaksi</p>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTransaction(null);
        }}
        title="Detail Transaksi"
        size="lg"
      >
        {selectedTransaction && (
          <Receipt
            transaction={selectedTransaction}
            items={selectedTransaction.transaction_items || []}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
