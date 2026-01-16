import { z } from "zod";

export const ProductSchema = z.object({
  productName: z.string().min(1, "Product name required"),
  price: z.number().min(1, "Price required"),
  description: z.string().min(1, "Description required"),
  imageUrl: z.string().url("Invalid URL"),
  stockQuantity: z.number().min(0),
  category: z.string().min(1, "Category required"),
});