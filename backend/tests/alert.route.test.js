const request = require("supertest");
const express = require("express");
const alertRoutes = require("../src/routes/alert.route.js");
const alertService = require("../src/services/alert.service.js");
const Alert = require("../src/models/alert.model.js");

jest.mock("../src/services/alert.service.js");

const app = express();
app.use(express.json());
app.use("/api/v1/alerts", alertRoutes);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    });
});

afterEach(async () => {
    await Alert.deleteMany({});
});

describe("Alert Routes API Tests", () => {
    
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe("POST /api/v1/alerts", () => {
        it("should create a new alert and return 201 when data is valid", async () => {
            const mockAlert = {
                alertId: "alt_123",
                title: "Brute Force Detected",
                description: "5 failed logins in 60s",
                severity: "high",
                ruleName: "brute_force_auth",
                entity: "jsmith"
            };

            alertService.createAlert.mockResolvedValue(mockAlert);

            const response = await request(app)
                .post("/api/v1/alerts")
                .send(mockAlert);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.alertId).toBe("alt_123");
            expect(alertService.createAlert).toHaveBeenCalledTimes(1);
        });

        it("should return 400 if Zod validation fails (missing required field)", async () => {
            const badPayload = {
                title: "Too short", 
            };

            const response = await request(app)
                .post("/api/v1/alerts")
                .send(badPayload);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(alertService.createAlert).not.toHaveBeenCalled(); 
        });
    });

    describe("GET /api/v1/alerts", () => {
        it("should return a list of alerts and pagination meta", async () => {
            const mockData = {
                alerts: [{ alertId: "alt_1" }, { alertId: "alt_2" }],
                meta: { total: 2, page: 1, limit: 20, totalPages: 1 }
            };

            alertService.getAlerts.mockResolvedValue(mockData);

            const response = await request(app).get("/api/v1/alerts");

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.meta.total).toBe(2);
            expect(alertService.getAlerts).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe("GET /api/v1/alerts/:id", () => {
        it("should return a single alert if found", async () => {
            const mockAlert = { alertId: "alt_999", title: "Test Alert" };
            alertService.getAlertById.mockResolvedValue(mockAlert);

            const response = await request(app).get("/api/v1/alerts/alt_999");

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe("Test Alert");
        });

        it("should return 404 if alert is not found", async () => {
            alertService.getAlertById.mockResolvedValue(null);

            const response = await request(app).get("/api/v1/alerts/alt_missing");

            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/not found/i);
        });
    });

    describe("PATCH /api/v1/alerts/:id", () => {
        it("should update an alert status and return 200", async () => {
            const mockUpdatedAlert = { alertId: "alt_123", status: "resolved" };
            alertService.updateAlert.mockResolvedValue(mockUpdatedAlert);

            const response = await request(app)
                .patch("/api/v1/alerts/alt_123")
                .send({ status: "resolved" });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe("resolved");
            expect(alertService.updateAlert).toHaveBeenCalledWith("alt_123", { status: "resolved" });
        });

        it("should return 400 if updating with an invalid status", async () => {
            const response = await request(app)
                .patch("/api/v1/alerts/alt_123")
                .send({ status: "fake_status" }); 

            expect(response.status).toBe(400);
            expect(alertService.updateAlert).not.toHaveBeenCalled();
        });
    });
});
