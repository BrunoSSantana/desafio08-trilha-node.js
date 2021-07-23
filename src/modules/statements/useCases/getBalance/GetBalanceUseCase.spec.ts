import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorystatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance a User", ()=> {
  beforeEach( ()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemorystatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemorystatementsRepository,inMemoryUsersRepository);
  });

  it("should be able to get balance a user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@test.com",
      password: "1234",
    });
    await inMemorystatementsRepository.create({
      amount: 300,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    })
    await inMemorystatementsRepository.create({
      amount: 100,
      description: "test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    })
    const balance = await getBalanceUseCase.execute({user_id: user.id as string});
    
    expect(balance).toHaveProperty("statement")
    expect(balance).toHaveProperty("balance")
  });

  it("should not be able to get balance a non-existent user", async () => {
    await inMemorystatementsRepository.create({
      amount: 160,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: "13"
    })

    expect(async () => {
      await getBalanceUseCase.execute({user_id: "13"})
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})