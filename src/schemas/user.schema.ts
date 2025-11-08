import { z } from "zod";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; 
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, '')); 
};

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Zod Schema
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters long")
      .trim(),
    
    email: z.string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .refine(validateEmail, "Please enter a valid email address")
      .trim(),
    
    phone: z.string()
      .min(1, "Phone number is required")
      .refine(validatePhone, "Please enter a valid phone number")
      .trim(),
    
    address: z.string()
      .min(1, "Address is required")
      .min(5, "Please enter a complete address")
      .trim(),
    
    role: z.string()
      .min(1, "Please select a role"),
    
    password: z.string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .refine(validatePassword, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    
    confirmPassword: z.string()
      .min(1, "Please confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })
});

// Type inference 
export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];