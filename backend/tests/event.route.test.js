const request = require("supertest");
const app = require("../src/app.js"); 
const Event = require("../src/models/event.model.js");

describe("Telemetry API", () => {
    
    beforeEach(async () => {
        await Event.deleteMany({});
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
