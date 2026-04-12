import React, { useEffect, useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminCategories() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách danh mục' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/categories', { name: newName });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã tạo danh mục' });
      setNewName('');
      setIsAdding(false);
      loadCategories();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tạo danh mục' });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!isEditing.name.trim()) return;
    try {
      await api.put(`/categories/${id}`, { name: isEditing.name });
      addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật danh mục' });
      setIsEditing({ id: null, name: '' });
      loadCategories();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật danh mục' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.category) return;
    try {
      await api.delete(`/categories/${confirmDelete.category.id}`);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa danh mục' });
      setConfirmDelete({ isOpen: false, category: null });
      loadCategories();
    } catch (error: any) {
      // Typically backend will return 404 with specific message if products exist
      const msg = error?.response?.data?.message || error?.message || 'Không thể xóa danh mục';
      addToast({ type: 'error', title: 'Thất bại', message: msg });
      setConfirmDelete({ isOpen: false, category: null });
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection 
        title="Quản lý Danh mục" 
        subtitle="Thêm, sửa, xóa các danh mục ngành hàng."
        actions={
          <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
            <Plus size={16} /> Thêm Danh mục
          </button>
        }
      >
        {isAdding && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex gap-3 items-center">
            <input 
              type="text" 
              className="input flex-1" 
              placeholder="Tên danh mục mới..." 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              autoFocus
            />
            <button onClick={handleCreate} className="btn-primary py-2 px-4">Lưu</button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary py-2 px-4">Hủy</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-wider font-bold text-slate-500">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Tên danh mục</th>
                    <th className="p-4 text-center">Số lượng SP</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {categories.map(cat => (
                    <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 text-slate-400 font-mono text-xs">{cat.id.substring(0,8)}</td>
                      <td className="p-4">
                        {isEditing.id === cat.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              className="input py-1.5 px-3 text-sm h-auto" 
                              value={isEditing.name} 
                              onChange={e => setIsEditing({ ...isEditing, name: e.target.value })}
                            />
                            <button onClick={() => handleUpdate(cat.id)} className="text-primary font-bold text-xs">Lưu</button>
                            <button onClick={() => setIsEditing({ id: null, name: '' })} className="text-slate-500 font-bold text-xs">Hủy</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-bold text-slate-900 group">
                            <FolderTree size={16} className="text-slate-400" />
                            {cat.name}
                            <span className="text-xs font-normal text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">/{cat.slug}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-slate-600">
                        {cat._count?.products || 0}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setIsEditing({ id: cat.id, name: cat.name })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ isOpen: true, category: cat })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-medium">Chưa có danh mục nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardSection>

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
