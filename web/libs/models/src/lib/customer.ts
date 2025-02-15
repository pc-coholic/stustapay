import { z } from "zod";
import { AccountSchema } from "./account";
import { OrderSchema } from "./order";

export const CustomerInfoSchema = z.object({
  iban: z.string(),
  account_name: z.string(),
  email: z.string(),
  donation: z.number(),
});

export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;

export const CustomerSchema = AccountSchema.merge(CustomerInfoSchema);
export type Customer = z.infer<typeof CustomerSchema>;

export const BonSchema = z.object({
  bon_generated: z.boolean().nullable(),
  bon_output_file: z.string().nullable(),
});

export const OrderWithBonSchema = OrderSchema.merge(BonSchema);
export type OrderWithBon = z.infer<typeof OrderWithBonSchema>;
