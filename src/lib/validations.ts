import { z } from "zod";

/** International-friendly mobile: optional +, 8–15 digits. */
const intlPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid mobile number with country code"));

export const inquirySchema = z.object({
  type: z.enum(["CONTACT", "SUPPORT", "WARRANTY", "RETURN"]).default("CONTACT"),
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  orderNumber: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(4000),
});

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
});

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable(),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  phone: intlPhone,
  address: z.string().trim().min(6, "Enter a complete delivery address").max(300),
  city: z.string().trim().min(2, "Select a city").max(60),
  area: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "SSLCOMMERZ"]),
  lines: z.array(cartLineSchema).min(1, "Your cart is empty").max(50),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  authorName: z.string().trim().min(2).max(60),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  comment: z.string().trim().min(10, "Reviews need at least 10 characters").max(2000),
});

export const loginSchema = z.object({
  /** Username or email */
  identifier: z.string().trim().min(3, "Enter your username or email").max(120),
  password: z.string().min(8).max(200),
});

const strongPassword = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(200)
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a symbol");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(80),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters")
      .max(32)
      .regex(/^[a-z0-9._-]+$/, "Use letters, numbers, dots, underscores or dashes"),
    email: z.email("Enter a valid email").trim().toLowerCase(),
    password: strongPassword,
    confirmPassword: z.string().min(1, "Confirm your password"),
    masterKey: z.string().min(1, "Enter the master key"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes"),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().min(10).max(8000),
  sku: z.string().trim().min(3).max(40),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional().or(z.literal("").transform(() => undefined)),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  featured: z.coerce.boolean().default(false),
  categoryId: z.string().min(1, "Choose a category"),
  deviceIds: z.array(z.string()).default([]),
  highlights: z.string().optional().default(""),
  imageUrls: z.string().optional().default(""),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CartLineInput = z.infer<typeof cartLineSchema>;

export type FormState<T extends string = string> = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<T, string[]>>;
};

export const initialFormState: FormState = { status: "idle" };

export function invalid(error: z.ZodError): FormState {
  return {
    status: "error",
    message: "Please fix the highlighted fields.",
    fieldErrors: z.flattenError(error).fieldErrors as FormState["fieldErrors"],
  };
}
