import React, { useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Search, Plus, Trash2, Edit2, Archive, QrCode } from 'lucide-react';
import { batches, Batch } from '../../../data/batchMockData';
import { products } from '../../../data/mockData';
import { BatchForm } from './BatchForm';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function BatchManagement() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  
  const [batchList, setBatchList] = useState<Batch[]>(batches);
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  const getProductName = (pid: string) => {
    return products.find(p => p.id === pid)?.name || 'Unknown Product';
  };

  const handleCreate = () => {
    setEditingBatch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (b: Batch) => {
    setEditingBatch(b);
    setIsFormOpen(true);
  };

  const handleDelete = (b: Batch) => {
    setBatchToDelete(b);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (batchToDelete) {
      setBatchList(prev => prev.filter(b => b.id !== batchToDelete.id));
      addToast({ type: 'success', title: t('success') || 'Đã xóa', message: t('delete_batch_success', { batchNumber: batchToDelete.batchNumber }) });
    }
  };

  const handleSave = (formData: any) => {
    if (editingBatch) {
      setBatchList(prev => prev.map(b => b.id === editingBatch.id ? { ...b, ...formData } : b));
      addToast({ type: 'success', title: t('complete'), message: t('update_batch_success', { batchNumber: formData.batchNumber }) });
    } else {
      setBatchList(prev => [{ ...formData, id: 'b' + Date.now(), qrGenerated: false }, ...prev]);
      addToast({ type: 'success', title: t('complete'), message: t('create_batch_success', { batchNumber: formData.batchNumber }) });
    }
    setIsFormOpen(false);
  };

  const generateQRMock = (b: Batch) => {
    if (b.qrGenerated) return; // already has one
    setBatchList(prev => prev.map(item => item.id === b.id ? { ...item, qrGenerated: true } : item));
    addToast({ type: 'success', title: t('generate_qr_success'), message: t('generate_qr_success_desc', { batchNumber: b.batchNumber }) });
  };

  return (
    <DashboardSection 
      title={t('batch_mgmt_title')} 
      subtitle={t('batch_mgmt_subtitle')}
      actions={
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {t('create_new_batch')}
        </button>
      }
    >
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full md:w-80">
          <input type="text" placeholder={t('search_batch')} className="input py-2 pl-10" />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {batchList.length === 0 ? (
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
                    <span className="text-sm font-medium">{getProductName(batch.productId)}</span>
                  </td>
                  <td className="table-cell">
                    <div className="text-xs">
                      <div><span className="text-slate-500">{t('batch_mfg')}</span> {batch.manufactureDate}</div>
                      <div><span className="text-slate-500">{t('batch_exp')}</span> {batch.expiryDate}</div>
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
                        onClick={() => generateQRMock(batch)}
                        className="text-[10px] font-bold uppercase text-viet-red border border-viet-red px-2 py-1 rounded hover:bg-viet-red hover:text-white transition-colors"
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
    </DashboardSection>
  );
}
