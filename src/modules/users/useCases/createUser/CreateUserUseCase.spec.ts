import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", ()=> {
  beforeEach( ()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with existing email", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test@test.com",
      password: "1234",
    }
    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(async ()=>{
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})