import { app } from "../../.././../app";
import request from "supertest";

import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import { v4 } from "uuid";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = v4();
    const password = await hash("test123", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at)
      VALUES('${id}', 'test', 'test@testmail.com', '${password}', 'now()' )`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able create to new deposit", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;
    
    const responseStatement = await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 100,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(responseStatement.status).toBe(201)
    expect(responseStatement.body).toHaveProperty("id")
  });

  it("should be able create to new withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;

    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 100,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    const responseStatement = await request(app).post(`/api/v1/statements/withdraw`).send({
      amount: 10,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(responseStatement.status).toBe(201)
    expect(responseStatement.body).toHaveProperty("id")
  });

  it("should not be able to statement operation without authenticate", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;

    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 100,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    const responseStatement = await request(app).post(`/api/v1/statements/withdraw`).send({
      amount: 10,
      description: "Test description",
    });

    expect(responseStatement.status).toBe(401)
  });

  it("should not be able to withdraw if don't have enough balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@testmail.com",
      password: "test123",
    });

    const { token } = responseToken.body;

    await request(app).post(`/api/v1/statements/deposit`).send({
      amount: 10,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    const responseStatement = await request(app).post(`/api/v1/statements/withdraw`).send({
      amount: 10000,
      description: "Test description",
    }).set({
      Authorization: `Bearer ${token}`,
    });
    
    expect(responseStatement.status).toBe(500);
  });
});