import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Archive, QrCode, Loader2 } from 'lucide-react';
import { BatchForm } from './BatchForm';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function BatchManagement() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [batchList, setBatchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<any | null>(null);

  const fetchBatches = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/batches/supplier/${user.supplier?.id}`);
      setBatchList(res.data);
    } catch (err) {
      console.error('Failed to fetch batches', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBatches();
  }, [user]);

  const getProductName = (batch: any) => {
    return batch.product?.name || 'Unknown Product';
  };

  const handleCreate = () => {
    setEditingBatch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (b: any) => {
    setEditingBatch(b);
    setIsFormOpen(true);
  };

  const handleDelete = (b: any) => {
    setBatchToDelete(b);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (batchToDelete) {
      // Assuming a DELETE endpoint exists, if not we just fake UI delete for now
      // await api.delete(`/batches/${batchToDelete.id}`);
      setBatchList(prev => prev.filter(b => b.id !== batchToDelete.id));
      addToast({ type: 'success', title: t('success') || 'Đã xóa', message: t('delete_batch_success', { batchNumber: batchToDelete.batchNumber }) });
      setIsDeleteOpen(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingBatch) {
        // PUT /batches/:id if implemented
        setBatchList(prev => prev.map(b => b.id === editingBatch.id ? { ...b, ...formData } : b));
        addToast({ type: 'success', title: t('complete'), message: t('update_batch_success', { batchNumber: formData.batchNumber }) });
      } else {
        const payload = {
          ...formData
        };
        await api.post('/batches', payload);
        addToast({ type: 'success', title: t('complete'), message: t('create_batch_success', { batchNumber: formData.batchNumber }) });
        fetchBatches();
      }
      setIsFormOpen(false);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Lỗi khi lưu lô hàng' });
    }
  };

  const generateQRCodes = async (b: any) => {
    if (b.qrGenerated) return;
    try {
      await api.post('/batches/qr/generate', {
        batchId: b.id,
        count: 1
      });
      addToast({ type: 'success', title: t('generate_qr_success'), message: t('generate_qr_success_desc', { batchNumber: b.batchNumber }) });
      fetchBatches();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Lỗi tạo QR' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('batch_mgmt_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('batch_mgmt_subtitle')}</p>
      </div>
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full md:w-80">
          <input type="text" placeholder={t('search_batch')} className="input py-2 pl-10" />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : batchList.length === 0 ? (
        <EmptyState 
          icon={<Archive size={48} className="text-slate-300" />}
          title={t('no_batches')}
          description={t('no_batches_desc')}
          action={<button className="btn-primary mt-4" onClick={handleCreate}>{t('create_first_batch')}</button>}
        />
      ) : (
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">{t('batch_table_no')}</th>
                <th className="px-6 py-4">{t('batch_table_product')}</th>
                <th className="px-6 py-4">{t('batch_table_time')}</th>
                <th className="px-6 py-4">{t('batch_table_quantity')}</th>
                <th className="px-6 py-4">{t('batch_table_status')}</th>
                <th className="px-6 py-4 text-center">{t('batch_table_qr')}</th>
                <th className="px-6 py-4 text-right">{t('batch_table_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchList.map((batch) => (
                <tr key={batch.id} className="table-row">
                  <td className="table-cell font-bold text-slate-800">
                    {batch.batchNumber}
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium">{getProductName(batch)}</span>
                  </td>
                  <td className="table-cell">
                    <div className="text-xs">
                      <div><span className="text-slate-500">{t('batch_mfg')}</span> {new Date(batch.manufactureDate).toLocaleDateString()}</div>
                      <div><span className="text-slate-500">{t('batch_exp')}</span> {new Date(batch.expiryDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="table-cell text-sm font-bold text-slate-600">
                    {batch.quantity}
                  </td>
                  <td className="table-cell">
                    {batch.status === 'active' && <Badge variant="success">{t('status_active')}</Badge>}
                    {batch.status === 'pending' && <Badge variant="info">{t('status_pending')}</Badge>}
                    {batch.status === 'expired' && <Badge variant="danger">{t('status_expired')}</Badge>}
                  </td>
                  <td className="table-cell text-center">
                    {batch.qrGenerated ? (
                      <Badge variant="primary" icon={<QrCode size={12}/>}>{t('qr_generated')}</Badge>
                    ) : (
                      <button 
                        onClick={() => generateQRCodes(batch)}
                        className="text-[10px] font-bold uppercase text-primary border border-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
                      >
                        {t('generate_qr')}
                      </button>
                    )}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn-icon" onClick={() => handleEdit(batch)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon-danger" onClick={() => handleDelete(batch)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Forms & Dialogs */}
      <BatchForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        batch={editingBatch}
        onSave={handleSave}
      />

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_batch_title')}
        message={t('delete_batch_confirm', { batchNumber: batchToDelete?.batchNumber })}
        confirmText={t('delete_permanently')}
      />
    </div>
  );
}
