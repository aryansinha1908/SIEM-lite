const request = require("supertest");
const app = require("../src/app.js"); 
const Event = require("../src/models/event.model.js");

jest.mock("../src/config/socket.js", () => ({
    getIO: () => ({
        emit: jest.fn() 
    })
}));

describe("Telemetry API", () => {
    
    beforeEach(async () => {
        await Event.deleteMany({});
    });

    describe("GET /api/v1/events/", () => {
        let testEvents;

        beforeEach(async () => {
            testEvents = await Event.insertMany([
                {
                    eventId: "evt_111",
                    timestamp: new Date().toISOString(),
                    source: { system: "Firewall" },
                    eventType: "AUTH_FAILURE",
                    severity: "critical",
                    action: "login_attempt"
                },
                {
                    eventId: "evt_222",
                    timestamp: new Date(Date.now() - 10000).toISOString(), 
                    source: { system: "API_Gateway" },
                    eventType: "RATE_LIMIT_EXCEEDED",
                    severity: "high",
                    action: "api_call"
                },
                {
                    eventId: "evt_333",
                    timestamp: new Date(Date.now() - 20000).toISOString(),
                    source: { system: "SSO_Portal" },
                    eventType: "AUTH_SUCCESS",
                    severity: "info",
                    action: "login"
                }
            ]);
        });

        it("should retrieve all events with default pagination and sorted by newest", async () => {
            const res = await request(app).get("/api/v1/events");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            
            expect(res.body.data.length).toBe(3);
            expect(res.body.meta.total).toBe(3);
            
            expect(res.body.data[0].eventId).toBe("evt_111");
        });

        it("should successfully filter events by severity", async () => {
            const res = await request(app).get("/api/v1/events?severity=critical");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].eventId).toBe("evt_111");
            expect(res.body.meta.total).toBe(1);
        });

        it("should successfully filter events by eventType", async () => {
            const res = await request(app).get("/api/v1/events?eventType=RATE_LIMIT_EXCEEDED");

            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].eventType).toBe("RATE_LIMIT_EXCEEDED");
        });

        it("should retrieve a single event by eventId", async () => {
            const res = await request(app).get("/api/v1/events/evt_333");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.eventId).toBe("evt_333");
            expect(res.body.data.eventType).toBe("AUTH_SUCCESS");
        });

        it("should return a 404 error if the eventId does not exist", async () => {
            const res = await request(app).get("/api/v1/events/evt_999_fake");

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/not found/i);
        });
    });

    describe("POST /api/v1/events/ingest", () => {
        
        it("should successfully ingest a full-fidelity security event", async () => {
            const fullEvent = {
                timestamp: new Date().toISOString(),
                source: {
                    system: "Okta_Auth_Gateway",
                    ip: "192.168.1.45",
                    hostname: "auth-node-02"
                },
                eventType: "AUTH_FAILURE",
                severity: "critical",
                category: "authentication",
                actor: {
                    username: "admin_test",
                    email: "hacker@evilcorp.com"
                },
                action: "login_attempt"
            };

            const res = await request(app)
                .post("/api/v1/events/ingest")
                .send(fullEvent);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            
            expect(res.body.data.eventId).toBeDefined();
            expect(res.body.data.eventId).toMatch(/^evt_/);
        });

        it("should successfully ingest a bare-minimum event and apply defaults", async () => {
            const minimalEvent = {
                timestamp: new Date().toISOString(),
                source: {
                    system: "Legacy_Internal_App"
                },
                eventType: "USER_CREATED",
                severity: "info",
                action: "create_user"
            };

            const res = await request(app)
                .post("/api/v1/events/ingest")
                .send(minimalEvent);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);

            const savedEvent = await Event.findOne({ eventId: res.body.data.eventId });
            expect(savedEvent.outcome).toBe("unknown");
            expect(savedEvent.processed).toBe(false);
        });

        it("should return 400 if validation fails (missing required fields)", async () => {
            const badEvent = {
                eventType: "AUTH_FAILURE",
                severity: "critical",
                action: "hack_the_mainframe"
            };

            const res = await request(app)
                .post("/api/v1/events/ingest")
                .send(badEvent);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should return 400 if data is formatted incorrectly (bad IP/Date)", async () => {
            const malformedEvent = {
                timestamp: "not-a-real-date",
                source: {
                    system: "Firewall",
                    ip: "999.999.999.999" 
                },
                eventType: "AUTH_FAILURE",
                severity: "critical",
                action: "login"
            };

            const res = await request(app)
                .post("/api/v1/events/ingest")
                .send(malformedEvent);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
