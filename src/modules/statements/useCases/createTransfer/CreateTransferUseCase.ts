import { inject, injectable } from "tsyringe";

import { Statement } from "@modules/statements/entities/Statement";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ICreateOperationDTO } from "../../dtos/ICreateOperationDTO";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    received_id,
    send_id,
    type,
    amount,
    description,
  }: ICreateOperationDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(received_id);

    if (!user) {
      throw new CreateTransferError.UserNotFound();
    }

    if (type === "transfer") {
      const { balance } = await this.statementsRepository.getUserBalance({
        received_id,
      });

      if (balance < amount) {
        throw new CreateTransferError.InsufficientFunds();
      }
    }

    const transferOperation = await this.statementsRepository.create({
      received_id,
      send_id,
      type,
      amount,
      description,
    });

    return transferOperation;
  }
}

export { CreateTransferUseCase };
