import { SupplierAccountHolderRole } from "@prisma/client";
export declare class SupplierApplicationDto {
    id?: string;
    accountHolderFullName?: string;
    accountHolderPhone?: string;
    accountHolderRole?: SupplierAccountHolderRole;
    accountHolderGovId?: string;
    accountHolderGovIdUrl?: string[];
    page?: number;
    limit?: number;
}
