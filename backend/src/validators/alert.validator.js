const { z } = require("zod");

const createAlertSchema = z.object({
        title: z.string().min(5),
        description: z.string().min(10),
        severity: z.enum(["critical", "high", "medium", "low", "info"]),
        ruleName: z.string(),
        entity: z.string(),
        sourceEvents: z.array(z.string()).optional()
});

const updateAlertSchema = z.object({
    status: z.enum(["new", "investigating", "resolved", "closed"]).optional(),
    severity: z.enum(["critical", "high", "medium", "low", "info"]).optional()
});

module.exports = { createAlertSchema, updateAlertSchema };
