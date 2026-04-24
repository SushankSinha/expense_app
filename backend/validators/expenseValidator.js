const { z } = require('zod');

const expenseSchema = z.object({
  amount: z.number().int({ message: "Amount must be a whole number inside safe numerical boundaries." }).min(1, "Amount must be greater than 0.").max(2147483647, "Amount exceeds maximum limit for PostgreSQL integer."),
  category: z.string().min(1),
  // Handle description so if user enters literal null or undefined, it's captured safely as a fallback string:
  description: z.string().nullish().transform(val => val || ''), 
  date: z.string()
});

module.exports = {
  expenseSchema
};
