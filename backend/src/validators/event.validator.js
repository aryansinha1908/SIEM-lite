const { z } = require("zod");

const ingestEventSchema = z.object({
    eventId: z.string().optional(),
    timestamp: z.string().datetime({ message: "timeStamp must be a valid ISO 8601 date string" }),
    source: z.object({
        system: z.string({ required_error: "Source System is required" }),
     ip: z.string().ipv4({ message: "Invalid IP Address format" }).optional(),
        hostname: z.string().optional(),
        application: z.string().optional()
    }),
    eventType: z.enum([
        "AUTH_FAILURE",
        "AUTH_SUCCESS",
        "PASSWORD_RESET_REQUEST",
        "PASSWORD_RESET_SUCCESS",
        "ADMIN_LOGIN",
        "SUSPICIOUS_API_CALL",
        "RATE_LIMIT_EXCEEDED",
        "TOKEN_VALIDATION_FAILURE",
        "DATA_EXPORT",
        "CONFIGURATION_CHANGE",
        "USER_CREATED",
        "USER_DELETED",
        "CUSTOM"
    ]),
    severity: z.enum([
        "critical",
        "high",
        "medium",
        "low",
        "info"
    ]),
    category: z.enum([
        "authentication",
        "authorization",
        "network",
        "application",
        "system",
        "data",
        "compliance"
    ]).optional(),
    actor: z.object({
        userId: z.string().optional(),
        username: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        ip: z.string().ipv4().optional(),
        userAgent: z.string().optional(),
        sessionId: z.string().optional()
    }).optional(),
    target: z.object({
        resourceType: z.string().optional(),
        id: z.string().optional(),
        name: z.string().optional()
    }).optional(),
    action: z.string({ required_error: "Action is Required" }),
    outcome: z.enum([
        "success",
        "failure",
        "unknown"
    ]).default("unknown"),
    details: z.record(z.any()).optional(),
    rawData: z.record(z.any()).optional(),
    tags: z.array(z.string()).optional(),
    relatedEvents: z.array(z.string()).optional(),
    processed: z.boolean().default(false),
    matchedRules: z.array(z.string()).optional(),
    metadata: z.object({
        version: z.string().optional(),
        schema: z.string().optional()
    }).optional()
});

module.exports = { ingestEventSchema };
