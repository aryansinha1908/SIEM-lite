const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        await collections[key].deleteMany();
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});


describe("Authentication API", () => {

    const testUser = {
        username: "TestUser123",
        email: "test@email.com",
        password: "Password123",
        role: "analyst"
    };

    let registeredUserId;

    describe("POST api/v1/auth/register", () => {
        it("should sucessfully register a new user", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe(testUser.email);
            expect(res.body.data.user.password).toBeUndefined();
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    username: "TestUser123",
                    email: "test@email.com"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);
            
            registeredUserId = res.body.data.user._id;
        });

        it('should successfully login and set cookies', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                email: testUser.email,
                password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies.some(cookie => cookie.includes('accessToken'))).toBe(true);
            expect(cookies.some(cookie => cookie.includes('refreshToken'))).toBe(true);
        });
    });
    describe('POST /api/v1/auth/logout', () => {
        it('should clear cookies on logout', async () => {
            const res = await request(app)
                .post('/api/v1/auth/logout')
                .send({ userId: registeredUserId });

            expect(res.statusCode).toBe(200);
            
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            
            expect(cookies.some(cookie => cookie.includes('accessToken=;'))).toBe(true);
        });
    });
});
