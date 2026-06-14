export declare enum ApplicantRole {
    Owner = "OWNER",
    LegalRep = "LEGAL_REP",
    Manager = "MANAGER",
    Employee = "EMPLOYEE"
}
export declare class SupplierApplicationDto {
    id?: number;
    first_name?: string;
    last_name?: string;
    applicant_role?: ApplicantRole;
    gov_id?: string;
    gov_id_url?: string[];
    email?: string;
    phone?: string;
    page?: number;
    limit?: number;
}
