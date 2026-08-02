import { SaleChannels } from "./enums";

export type CertEntry = {id: string; name: string; issuedBy: string; documentUrl: string}
export type SaleChanEntry = {type: SaleChannels; url: string}
export type AddressRecord = {isPrimary: boolean; address: string}

export type SuppCategory = { name: string; nameEn: string; id: string; }

export type l1Category = { slug: string; id: string; name: string; }

export type PayloadCategoryOption = {id: string; name: string; slug: string; included: boolean}

