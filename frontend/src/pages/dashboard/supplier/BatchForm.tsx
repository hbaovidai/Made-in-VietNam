import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { products } from '../../../data/mockData';
import { Batch } from '../../../data/batchMockData';
import { useTranslation } from 'react-i18next';

interface BatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  batch?: Batch | null;
  onSave: (batch: any) => void;
}

export function BatchForm({ isOpen, onClose, batch, onSave }: BatchFormProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  
  // Get supplier's products - memoized to prevent infinite loops
  const supplierProducts = useMemo(() => products.filter((p) => p.supplierId === 's1'), [products]);

  const [formData, setFormData] = useState({
    productId: supplierProducts[0]?.id || '',
    batchNumber: '',
    manufactureDate: '',
    expiryDate: '',
    quantity: 100,
    status: 'active' as const,
    qrGenerated: false,
  });

  useEffect(() => {
    if (batch) {
      setFormData(batch as any);
    } else {
      setFormData({
        productId: supplierProducts[0]?.id || '',
        batchNumber: `LOT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        manufactureDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        quantity: 100,
        status: 'active',
        qrGenerated: false,
      });
    }
  }, [batch, isOpen, supplierProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.productId || !formData.batchNumber || !formData.manufactureDate || !formData.expiryDate) {
      addToast({ type: 'error', title: t('missing_info'), message: t('fill_required_fields') });
      return;
    }
    
    const mDate = new Date(formData.manufactureDate);
    const eDate = new Date(formData.expiryDate);
    if (eDate <= mDate) {
      addToast({ type: 'error', title: t('error'), message: t('expiry_after_mfg') });
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={batch ? t('edit_batch') : t('create_batch')}
      size="sm"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn-primary" onClick={handleSubmit}>
            {batch ? t('save_changes') : t('create_batch')}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="input-label">{t('batch_product_label')}</label>
          <select
            name="productId"
            className="input"
            value={formData.productId}
            onChange={handleChange}
          >
            {supplierProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="input-label">{t('batch_number_label')}</label>
          <input
            name="batchNumber"
            type="text"
            className="input"
            value={formData.batchNumber}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">{t('manufacture_date_label')}</label>
            <input
              name="manufactureDate"
              type="date"
              className="input"
              value={formData.manufactureDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="input-label">{t('expiry_date_label')}</label>
            <input
              name="expiryDate"
              type="date"
              className="input"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">{t('quantity_optional_label')}</label>
            <input
              name="quantity"
              type="number"
              className="input"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="input-label">{t('current_status_label')}</label>
            <select
              name="status"
              className="input"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">{t('status_active')}</option>
              <option value="pending">{t('status_pending')}</option>
              <option value="expired">{t('status_expired')}</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}
