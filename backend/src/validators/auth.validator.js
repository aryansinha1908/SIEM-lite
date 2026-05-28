const z = require("zod");

const registerSchema = z.object({
    username: z.string().min(3, "Username should be longer than 2 characters"),
    email: z.string().email("Please provide an email address"),
    password: z.string()
        .min(8, "Password should be atleast 8 characters long")
        .regex(/[A-Z]/, "Password should contain an uppercase letter")
        .regex(/[0-9]/, "Password should contain a number"),
    role: z.enum(["admin", "analyst"]),
}).strict();

const loginSchema = z.object({
    email: z.string().email("Please Provide an Email Address"),
    password: z.string().min(8, "Please Provide a password")
});

const logoutSchema = z.object({
    userId: z.string()
})

module.exports = { loginSchema, registerSchema, logoutSchema };
