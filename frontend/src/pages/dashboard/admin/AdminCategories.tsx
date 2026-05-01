import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Plus, Edit2, Trash2, FolderTree, Search } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminCategories() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; category: any }>({
    isOpen: false, category: null
  });

  const [isEditing, setIsEditing] = useState<{ id: string | null; name: string }>({ id: null, name: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_load_error') });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/categories', { name: newName });
      addToast({ type: 'success', title: t('admin_success'), message: t('admin_cat_created') });
      setNewName('');
      setIsAdding(false);
      loadCategories();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_cat_create_error') });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!isEditing.name.trim()) return;
    try {
      await api.put(`/categories/${id}`, { name: isEditing.name });
      addToast({ type: 'success', title: t('admin_success'), message: t('admin_cat_updated') });
      setIsEditing({ id: null, name: '' });
      loadCategories();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_cat_update_error') });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.category) return;
    try {
      await api.delete(`/categories/${confirmDelete.category.id}`);
      addToast({ type: 'success', title: t('admin_success'), message: t('admin_cat_deleted') });
      setConfirmDelete({ isOpen: false, category: null });
      loadCategories();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || t('admin_cat_delete_error');
      addToast({ type: 'error', title: t('admin_cat_failed'), message: msg });
      setConfirmDelete({ isOpen: false, category: null });
    }
  };

  const filtered = categories.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('admin_categories_title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('admin_categories_subtitle')} — {categories.length}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} /> Thêm danh mục
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="flex gap-3 items-center">
          <input 
            type="text" 
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" 
            placeholder="Tên danh mục mới..." 
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button onClick={handleCreate} className="bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-xl">Lưu</button>
          <button onClick={() => { setIsAdding(false); setNewName(''); }} className="text-sm font-bold text-slate-500 px-3 py-2.5">Hủy</button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm danh mục..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pl-1">Tên danh mục</th>
                <th className="pb-3 text-center">Số lượng SP</th>
                <th className="pb-3 pr-1 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(cat => {
                const childProductCount = (cat.children || []).reduce((sum: number, c: any) => sum + (c._count?.products || 0), 0);
                const totalProducts = (cat._count?.products || 0) + childProductCount;
                return (
                  <React.Fragment key={cat.id}>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 pl-1">
                        {isEditing.id === cat.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary" 
                              value={isEditing.name} 
                              onChange={e => setIsEditing({ ...isEditing, name: e.target.value })}
                              onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                            />
                            <button onClick={() => handleUpdate(cat.id)} className="text-primary font-bold text-xs">Lưu</button>
                            <button onClick={() => setIsEditing({ id: null, name: '' })} className="text-slate-400 font-bold text-xs">Hủy</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FolderTree size={15} className="text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-900">{cat.name}</span>
                            {cat.children?.length > 0 && (
                              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {cat.children.length} con
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-center font-semibold text-slate-600">{totalProducts}</td>
                      <td className="py-4 pr-1 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setIsEditing({ id: cat.id, name: cat.name })}
                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ isOpen: true, category: cat })}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Subcategories */}
                    {(cat.children || []).map((sub: any) => (
                      <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 pl-8">
                          {isEditing.id === sub.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary" 
                                value={isEditing.name} 
                                onChange={e => setIsEditing({ ...isEditing, name: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleUpdate(sub.id)}
                              />
                              <button onClick={() => handleUpdate(sub.id)} className="text-primary font-bold text-xs">Lưu</button>
                              <button onClick={() => setIsEditing({ id: null, name: '' })} className="text-slate-400 font-bold text-xs">Hủy</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-500">
                              <span className="text-slate-300">└</span>
                              <span className="font-medium">{sub.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-center text-xs font-medium text-slate-400">{sub._count?.products || 0}</td>
                        <td className="py-3 pr-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => setIsEditing({ id: sub.id, name: sub.name })}
                              className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button 
                              onClick={() => setConfirmDelete({ isOpen: true, category: sub })}
                              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="py-16 text-center text-slate-400 text-sm">Chưa có danh mục nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
        onConfirm={handleDelete}
        title="Xóa danh mục?"
        message={`Bạn có chắc chắn muốn xóa danh mục "${confirmDelete.category?.name}"? Hành động này sẽ thất bại nếu danh mục vẫn còn sản phẩm.`}
        confirmText="Xóa danh mục"
        variant="danger"
      />
    </div>
  );
}
