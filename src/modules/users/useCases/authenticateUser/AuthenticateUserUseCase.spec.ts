import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", ()=> {
  beforeEach( ()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@test.com",
      password: "1234",
    }
    const result = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
  });

  it("should not be able to authenticate an unregistered user", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@test.com",
      password: "1234",
    }
    expect(async() => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });
  it("should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@test.com",
      password: "1234",
    }
    const result = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "passwordIncorrect",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})