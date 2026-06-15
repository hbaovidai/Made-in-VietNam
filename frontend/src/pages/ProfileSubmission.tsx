import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { UserPlus, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function ProfileSubmission() {

    const [companyName, setCompanyName] = useState("");
    const [taxCode, setTaxCode] = useState("");

    const [organizationType, setOrganizationType] = useState("");

    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [streetAddress, setStreetAddress] = useState("");

    const [businessLicense, setBusinessLicense] =
    useState<File | null>(null);

    const [authorizationLetter, setAuthorizationLetter] =
    useState<File | null>(null);

    const [businessModel, setBusinessModel] =
    useState("");

    /*
    Pass this from previous page,
    auth context or api
    */
    const [position, setPosition] = useState("");
    return (
        <AuthLayout>

        <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">

        <div className="px-10 py-10 space-y-4">

            {/* Company Name */}

            <div className="space-y-2">

            <label className="text-[13px] font-bold text-[#0F172A]">
                Tên chính thức của Doanh nghiệp
            </label>

            <input
                required
                type="text"
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                placeholder="CÔNG TY TNHH CÀ PHÊ VIỆT"
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            />

            </div>


            {/* Tax code */}

            <div className="space-y-2">

            <label className="text-[13px] font-bold text-[#0F172A]">
                Mã số thuế / Mã số doanh nghiệp
            </label>

            <input
                required
                type="text"
                value={taxCode}
                onChange={(e)=>setTaxCode(e.target.value)}
                placeholder="0312345678"
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            />

            </div>


            {/* Organization Type */}

            <div className="space-y-3">

            <label className="text-[13px] font-bold text-[#0F172A]">
                Loại hình tổ chức
            </label>

            <div className="flex gap-6 text-sm">

                <label className="flex items-center gap-2">

                <input
                    type="radio"
                    value="LLC"
                    checked={organizationType==="LLC"}
                    onChange={(e)=>setOrganizationType(e.target.value)}
                />

                Công ty TNHH

                </label>


                <label className="flex items-center gap-2">

                <input
                    type="radio"
                    value="JSC"
                    checked={organizationType==="JSC"}
                    onChange={(e)=>setOrganizationType(e.target.value)}
                />

                Cổ phần

                </label>


                <label className="flex items-center gap-2">

                <input
                    type="radio"
                    value="PRIVATE"
                    checked={organizationType==="PRIVATE"}
                    onChange={(e)=>setOrganizationType(e.target.value)}
                />

                DN Tư nhân

                </label>

            </div>

            </div>


            {/* Address */}

            <div className="space-y-2">

            <label className="text-[13px] font-bold text-[#0F172A]">
                Địa chỉ trụ sở chính (theo ĐKKD)
            </label>

            <select
                value={province}
                onChange={(e)=>setProvince(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            >
                <option>Tỉnh / Thành phố</option>
            </select>


            <select
                value={district}
                onChange={(e)=>setDistrict(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            >
                <option>Quận / Huyện</option>
            </select>


            <select
                value={ward}
                onChange={(e)=>setWard(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            >
                <option>Phường / Xã</option>
            </select>


            <input
                type="text"
                value={streetAddress}
                onChange={(e)=>setStreetAddress(e.target.value)}
                placeholder="Số nhà, tên đường"
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            />

            </div>


            {/* Business License */}

            <div className="space-y-2">

            <label className="text-[13px] font-bold text-[#0F172A]">
                Giấy phép Đăng ký kinh doanh (ĐKKD)
            </label>

            <input
                required
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e)=>
                setBusinessLicense(
                    e.target.files?.[0] || null
                )
                }
            />

            </div>


            {/* Conditional */}

            {position === "BUSINESS" && (

            <div className="space-y-2">

                <label className="text-[13px] font-bold text-[#0F172A]">

                Giấy ủy quyền từ ban giám đốc

                </label>

                <input
                required
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e)=>
                    setAuthorizationLetter(
                    e.target.files?.[0] || null
                    )
                }
                />

            </div>

            )}


            {/* Business Model */}

            <div className="space-y-2">

            <label className="text-[13px] font-bold text-[#0F172A]">

                Mô hình hoạt động chính trên sàn

            </label>

            <select
                required
                value={businessModel}
                onChange={(e)=>setBusinessModel(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl"
            >

                <option value="">
                Chọn mô hình
                </option>

                <option value="MANUFACTURER">
                Nhà sản xuất trực tiếp (Manufacturer)
                </option>

                <option value="TRADING">
                Công ty thương mại (Trading / Wholesaler)
                </option>

                <option value="DISTRIBUTOR">
                Đại lý phân phối / Nhượng quyền
                </option>

                <option value="SERVICE_PROVIDER">
                Doanh nghiệp dịch vụ B2B
                </option>

                <option value="HYBRID">
                Mô hình hỗn hợp
                </option>

            </select>

            </div>


            {/* Submit */}

            <button

            type="submit"

            className="
                w-full
                bg-[#0F172A]
                hover:bg-[#1E293B]
                text-white
                py-3.5
                rounded-xl
                font-bold
                text-sm
                transition-colors
                mt-6
            ">

            Submit Company Profile

            </button>

        </div>

        </div>

        </AuthLayout>
    );
}