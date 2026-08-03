import { SaleChannels, SupplierStatus, SupplierType } from "./enums";

export type CertEntry = {id: string; name: string; issuedBy: string; documentUrl: string}
export type SaleChanEntry = {type: SaleChannels; url: string}
export type AddressEntry = {isPrimary: boolean; address: string}

export type SuppCategory = { name: string; nameEn: string; id: string; }
export type l1Category = { slug: string; id: string; name: string; }
export type CategoryOption = {id: string; name: string; slug: string; included: boolean}

export type CategoryIdMap = Record<string, {slug: string; name: string; included: boolean}>;
export type SaleChannelTypeMap = Record<SaleChannels, string>;

export type Supplier = {
  id?: string;
  supplierType?: SupplierType

  companyName?: string; description?: string;
  taxCode?: string; yearEstablished?: string; employee_count?: string;
  businessType?: string;

  contactEmail?: string; contactPhone?: string;
  legalRepName?: string;

  logo?: string; banner?: string;
  status?: SupplierStatus;

  categories?: {category: SuppCategory}[];

  channels?: SaleChanEntry[];

  addresses?: AddressEntry[];
};

export type SupplierPayload = Supplier & {
  categoryOptions?: CategoryOption[];
}
