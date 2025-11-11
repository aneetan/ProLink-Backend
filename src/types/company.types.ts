export interface CompanyAttributes{
   id: number;
   name: string;
   registrationNo: string;
   description: string;
   establishedYear: string;
   serviceCategory: string;
   websiteUrl ?: string;
   priceRangeMax: number;
   priceRangeMin: number;
   avgDeliveryTime: string;
   userId: number;
   createdAt: Date;
   updatedAt: Date;
}

export interface CompanyDocs {
   docsId: number;
   logo: Uint8Array;
   businessLicense: Uint8Array;
   taxCertificate: Uint8Array;
   ownerId?: Uint8Array;
   companyId: number;
}

export interface Services {
   serviceId: number;
   companyId: number;
   service: string;
}

export interface CompanyInfoDto{
   name: string;
   registrationNo: string;
   description: string;
   establishedYear: string;
   serviceCategory: string;
   websiteUrl: string;
}

export interface DocsDto{
   logo: File | null;
   businessLicense: File | null;
   taxCertificate: File | null;
   ownerId: File | null;
}

export interface ServicePricingDto{
   servicesOffered: string[];
   priceRangeMin: number;
   priceRangeMax: number;
   avgDeliveryTime: string;
}

export interface CompanyDto{
   companyInfo: CompanyInfoDto;
   docs: DocsDto;
   servicePricing: ServicePricingDto;
   userId: number;
}