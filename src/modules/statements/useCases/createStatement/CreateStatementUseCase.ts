import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "../../dtos/ICreateOperationDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ received_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(received_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ received_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      received_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
