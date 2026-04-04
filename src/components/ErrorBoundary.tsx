import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// ErrorBoundary phải dùng class component vì React chưa hỗ trợ hook cho error boundaries
// Sử dụng React.Component trực tiếp để tránh vấn đề TypeScript với generic imports

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={40} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Đã xảy ra lỗi</h1>
              <p className="text-slate-500 text-sm">
                Xin lỗi, đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại hoặc quay về trang chủ.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-left">
                <p className="text-xs font-mono text-slate-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                <RefreshCw size={18} />
                Tải lại trang
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Home size={18} />
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
