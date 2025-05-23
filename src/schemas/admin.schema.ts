import { z } from "zod";

export const adminSchema = z.object({
  name: z.string().min(3).max(256),
  email: z.string().email(),
  password: z.string().min(8).max(12),
});
