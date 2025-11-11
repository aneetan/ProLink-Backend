import z from "zod";

export const CompanySchema = z.object({
   body: z.object({
      companyInfoSchema:  z.object({
         name: z.string().min(1, 'Company name is required').max(255, 'Company name is too long'),
         registrationNo: z.string().min(1, 'Registration number is required'),
         description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
         establishedYear: z.string()
            .min(4, 'Invalid year')
            .max(4, 'Invalid year')
            .regex(/^\d{4}$/, 'Year must be 4 digits'),
         serviceCategory: z.string().min(1, 'Service category is required'),
         websiteUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
      }),

      servicePricingSchema: z.object({
         servicesOffered: z.array(z.string().min(3, 'Service cannot be empty'))
            .min(3, 'At least one service must be provided')
            .max(5, 'At most five service must be provided'),
         priceRangeMin: z.number()
            .int('Price must be an integer')
            .min(0, 'Minimum price cannot be negative'),
         priceRangeMax: z.number()
            .int('Price must be an integer')
            .min(0, 'Maximum price cannot be negative'),
         avgDeliveryTime: z.string().min(1, 'Average delivery time is required'),
         }).refine((data) => data.priceRangeMax >= data.priceRangeMin, {
         message: 'Maximum price must be greater than or equal to minimum price',
         path: ['priceRangeMax'],
      }),

      docsValidationSchema: z.object({
         logo: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, 'Logo must be less than 5MB')
            .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Logo must be JPEG, PNG or WebP')
            .nullable(),
         businessLicense: z.instanceof(File)
            .refine((file) => file.size <= 10 * 1024 * 1024, 'Business license must be less than 10MB')
            .refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), 'Must be PDF, JPEG or PNG')
            .nullable(),
         taxCertificate: z.instanceof(File)
            .refine((file) => file.size <= 10 * 1024 * 1024, 'Tax certificate must be less than 10MB')
            .refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), 'Must be PDF, JPEG or PNG')
            .nullable(),
         ownerId: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, 'Owner ID must be less than 5MB')
            .refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), 'Must be PDF, JPEG or PNG')
            .nullable()
            .optional(),
      })
   })
});

export type CompanyInput = z.infer<typeof CompanySchema>['body'];