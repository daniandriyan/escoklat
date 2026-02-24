import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Coffee, ToggleLeft, ToggleRight } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/supabase';
import { Card, Modal, Button, Input, LoadingSpinner } from '../components';
import { formatRupiah } from '../utils/helpers';
import { hapticLight } from '../utils/helpers';

const variants = [
  'Original',
  'Matcha',
  'Taro',
  'Strawberry',
  'Hazelnut',
  'Oreo',
  'Coklat Susu',
  'Coklat Keju',
  'Coklat Kacang',
  'White Coklat',
  'Coklat Mocha',
  'Coklat Caramel',
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: 'Es Coklat',
    variant: '',
    price: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, showInactive]);

  const loadProducts = async () => {
    try {
      const { data, error } = await getProducts(false);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.variant.toLowerCase().includes(query)
      );
    }

    if (!showInactive) {
      filtered = filtered.filter((p) => p.is_active);
    }

    setFilteredProducts(filtered);
  };

  const handleOpenModal = (product = null) => {
    hapticLight();
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        variant: product.variant,
        price: product.price.toString(),
        is_active: product.is_active,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: 'Es Coklat',
        variant: '',
        price: '',
        is_active: true,
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: 'Es Coklat',
      variant: '',
      price: '',
      is_active: true,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nama produk wajib diisi';
    if (!formData.variant) errors.variant = 'Varian wajib dipilih';
    if (!formData.price || parseInt(formData.price) <= 0) {
      errors.price = 'Harga harus lebih dari 0';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        variant: formData.variant,
        price: parseInt(formData.price),
        is_active: formData.is_active,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      await loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (product) => {
    hapticLight();
    try {
      await updateProduct(product.id, { is_active: !product.is_active });
      await loadProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Hapus produk "${product.name} ${product.variant}"?`)) return;

    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between px-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glass w-full pl-12 pr-4 py-3"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2"
          >
            {showInactive ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
            {showInactive ? 'Semua' : 'Aktif'}
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    product.is_active
                      ? 'bg-gradient-to-br from-chocolate-500 to-chocolate-700'
                      : 'bg-gray-600'
                  }`}>
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-sm text-white/60">{product.variant}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(product)}
                  className={`p-2 rounded-lg transition-colors ${
                    product.is_active
                      ? 'text-green-400 hover:bg-green-500/20'
                      : 'text-white/40 hover:bg-white/10'
                  }`}
                >
                  {product.is_active ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-cream-300">
                  {formatRupiah(product.price)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!product.is_active && (
                <div className="mt-2 px-2 py-1 bg-white/10 rounded-lg text-xs text-white/50 inline-block">
                  Tidak Aktif
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/40">
            <Coffee className="w-16 h-16 mb-4 opacity-50" />
            <p>Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Produk"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            placeholder="Contoh: Es Coklat"
          />

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Varian Rasa
            </label>
            <select
              value={formData.variant}
              onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
              className="input-glass w-full"
            >
              <option value="">Pilih varian...</option>
              {variants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            {formErrors.variant && (
              <p className="mt-1.5 text-sm text-red-400">{formErrors.variant}</p>
            )}
          </div>

          <Input
            label="Harga (Rp)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={formErrors.price}
            placeholder="Contoh: 12000"
          />

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-chocolate-600 focus:ring-chocolate-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-white/80">
              Produk tersedia / aktif
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1">
              Batal
            </Button>
            <Button type="submit" loading={submitting} variant="accent" className="flex-1">
              {editingProduct ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
