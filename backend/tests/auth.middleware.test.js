const jwt = require("jsonwebtoken")
const isAuthenticated = require("../src/middlewares/auth.middleware");

jest.mock("../src/config/env.js", () => ({
    jwt : { accessSecret: "aryansinha" }
}));


describe("isAuthenticated Middleware", () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            cookies: {}
        };

        mockRes = {};
        mockNext = jest.fn();
    });

    it ("should throw a 401 error if no accessToken cookie exists", async () => {
        await isAuthenticated(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        const passedError = mockNext.mock.calls[0][0];
        expect(passedError.statusCode).toBe(401);
    });

    it ("should throw a 401 error if invalid or tampered token", async () => {
        mockReq.cookies.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiY2RlIiwicm9sZSI6ImFkbWluIn0.pGHV5x6xklCrTLmYeQkqMYb-heaJ30K7yHzEidav6N4";

        await isAuthenticated(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        const passedError = mockNext.mock.calls[0][0];
        expect(passedError.statusCode).toBe(401);
    });

    it ("should attach userId to req and call next() if token is valid", async () => {
        const validToken = jwt.sign({
            "id": "abcd",
            "role": "analyst"
        }, "aryansinha");

        mockReq.cookies.accessToken = validToken;


        await isAuthenticated(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(mockReq.userId).toBe("abcd");
    });
});
