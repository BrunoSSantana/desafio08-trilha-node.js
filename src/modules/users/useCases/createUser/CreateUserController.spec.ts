import { app } from "../../../../app";
import request from "supertest";
import { Connection } from "typeorm";

import createConnection from "../../../../database/"

let connection: Connection;

describe("Authenticate User", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@testmail.com",
      password: "test123",
    });
    expect(response.status).toBe(201)
  });

  it("should not be able to create a user with existing email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@testmail.com",
      password: "test123",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "Test",
      email: "test@testmail.com",
      password: "test123",
    });
    expect(response.status).toBe(400)
  });
});
