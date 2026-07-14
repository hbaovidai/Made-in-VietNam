---
name: VIEPRODUCT-Design-System
description: "Premium B2B Global Trade design system. Built with modern Inter typography, rich Navy layers for strict enterprise authority, and calculated Micro-Accents of Viet-Gold for premium trust indicators."

colors:
  primary: "#003366"       # Navy blue đậm
  primary-light: "#004080" # Navy sáng hơn
  primary-dark: "#002244"  # Navy tối (Dùng cho Sidebar và Text chính)
  viet-gold: "#FFCD00"     # Vàng gold (Dùng cho điểm nhấn, progress, badge)
  canvas: "#ffffff"        # Nền vùng nội dung chính
  surface-bg: "#f8fafc"    # Nền tổng thể dashboard (slate-50)
  card-bg: "#ffffff"       # Nền của các thẻ nội dung
  ink: "#0f172a"           # Chữ chính (slate-900)
  ink-muted: "#475569"     # Chữ phụ (slate-600)
  hairline: "#e2e8f0"      # Đường viền mảnh (slate-200)

typography:
  fontFamily: "Inter, sans-serif"
  page-title: { fontSize: "24px", fontWeight: 700, color: "{colors.primary-dark}" }
  section-title: { fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", color: "{colors.ink-muted}" }
  stat-number: { fontSize: "28px", fontWeight: 700, color: "{colors.primary}" }
  body: { fontSize: "14px", fontWeight: 400, color: "{colors.ink}" }
  body-emphasis: { fontSize: "14px", fontWeight: 600, color: "{colors.primary}" }

rounded:
  sm: "4px"    # Ô nhập liệu, component nhỏ
  md: "8px"    # Thẻ chỉ số (Stat Cards), biểu đồ, khung lớn
  pill: "9999px"

shadows:
  subtle: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)"

components:
  sidebar:
    backgroundColor: "{colors.primary-dark}"
    textColor: "rgba(255, 255, 255, 0.7)"
    activeTextColor: "#ffffff"
    activeBackgroundColor: "{colors.primary}"
    activeIndicator: "{colors.viet-gold}"
  card:
    backgroundColor: "{colors.card-bg}"
    borderRadius: "{rounded.md}"
    boxShadow: "{shadows.subtle}"
    border: "none"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    fontWeight: 600
    borderRadius: "{rounded.sm}"
---