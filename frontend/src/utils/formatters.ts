/**
 * Hàm định dạng hiển thị Giá bán Sản phẩm B2B theo 3 chế độ (Pricing Modes):
 * 1. STANDARD / FIXED: Giá cố định (vd: 150.000 ₫ hoặc khoảng 150.000 ₫ - 200.000 ₫)
 * 2. TIERED: Bảng giá sỉ theo bậc số lượng (vd: 40.000 ₫ - 50.000 ₫)
 * 3. NEGOTIABLE / CONTACT: Giá thương lượng (Hiển thị "Thỏa thuận" thay vì 0 ₫)
 */
export function formatProductPrice(product: any): string {
  if (!product) return 'Thỏa thuận';

  const mode = (product.pricingMode || '').toUpperCase();

  // 1. Chế độ Thương lượng (NEGOTIABLE / CONTACT) hoặc không có minPrice
  if (
    mode === 'NEGOTIABLE' ||
    mode === 'CONTACT' ||
    (!product.minPrice && (!product.priceTiers || product.priceTiers.length === 0))
  ) {
    return 'Thỏa thuận';
  }

  // 2. Chế độ Giá sỉ theo bậc (TIERED)
  if (mode === 'TIERED' && product.priceTiers && product.priceTiers.length > 0) {
    const prices = product.priceTiers
      .map((t: any) => Number(t.price))
      .filter((p: number) => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      if (minP === maxP) {
        return `${minP.toLocaleString('vi-VN')} ₫`;
      }
      return `${minP.toLocaleString('vi-VN')} - ${maxP.toLocaleString('vi-VN')} ₫`;
    }
  }

  // 3. Chế độ Giá cố định / Khoảng giá (STANDARD / FIXED)
  if (
    product.minPrice &&
    product.maxPrice &&
    Number(product.maxPrice) > Number(product.minPrice)
  ) {
    return `${Number(product.minPrice).toLocaleString('vi-VN')} - ${Number(product.maxPrice).toLocaleString('vi-VN')} ₫`;
  }

  if (product.minPrice && Number(product.minPrice) > 0) {
    return `${Number(product.minPrice).toLocaleString('vi-VN')} ₫`;
  }

  return 'Thỏa thuận';
}
