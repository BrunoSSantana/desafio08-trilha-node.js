import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ received_id, type, amount, description }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(received_id);

    if(!user) {
      throw new CreateTransferError.UserNotFound();
    }

    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ received_id });

      if (balance < amount) {
        throw new CreateTransferError.InsufficientFunds()
      }
    }

    const transferOperation = await this.statementsRepository.create({
      received_id,
      type,
      amount,
      description
    });

    return transferOperation;
  }
}

export { CreateTransferUseCase }
