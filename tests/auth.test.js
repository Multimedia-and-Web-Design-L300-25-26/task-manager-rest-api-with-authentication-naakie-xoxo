import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";

describe("Auth Routes", () => {

  let token;

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "naakie@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("naakie@example.com");
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "naakie@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });
  afterAll(async () => {
    await User.deleteMany({}); 
  });

});