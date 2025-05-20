// schemas.ts
import { z } from "zod";

// Vehicle Info Schema
export const vehicleInfoSchema = z.object({
  capacity: z.string().min(1, "Capacity is required"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  issuingState: z.string().min(1, "Issuing state is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  vehiclePhotoUrl: z.string().url("Invalid photo URL"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  type: z.string().min(1, "Vehicle type is required"),
  yearOfManufacture: z.string().regex(/^\d{4}$/, "Enter a valid year"),
});

// Owner Info Schema
export const ownerInfoSchema = z.object({
  dateOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date of birth"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  email: z.string().email("Invalid email"),
  gender: z.string().min(1, "Gender is required"),
  idNumber: z.string().min(1, "ID number is required"),
  lga: z.string().min(1, "LGA is required"),
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  idDocumentUrl: z.string().url("Invalid ID Document URL"),
  state: z.string().min(1, "State is required"),
});

// Driver Info Schema
export const driverInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date of birth"),
  gender: z.enum(["Male", "Female"]),
  nationality: z.string().min(1, "Nationality is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  residentialAddress: z.string().min(1, "Residential address is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  email: z.string().email("Invalid email"),
  nin: z.string().min(1, "NIN is required"),
  validIdUrl: z.string().url("Invalid ID URL"),
  passportUrl: z.string().url("Invalid passport URL"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseClass: z.enum(["A", "B", "C", "D", "E", "F"]),
  issuingAuthority: z.enum(["FRSC", "State VIO"]),
  issueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid issue date"),
  expiryDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid expiry date"),
  licenseUrl: z.string().url("Invalid license URL"),
});

export const routeInfoSchema = z.object({
  routeCode: z.string().length(2, "Route code is required"),
  state: z.string().min(3, "State is required"),
});

// Full Form Schema (optional, if you want to validate all at once)
export const fullFormSchema = z.object({
  vehicleInfo: vehicleInfoSchema,
  ownerInfo: ownerInfoSchema,
  driverInfo: driverInfoSchema,
  routeInfo: routeInfoSchema,
});
