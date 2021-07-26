import { Request, Response } from "express";
import { container } from "tsyringe";

import { OperationType } from "@modules/statements/entities/Statement";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: send_id } = request.user;
    const { amount, description } = request.body;
    const { user_id: received_id } = request.params;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      received_id,
      send_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    return response.status(201).json(transfer);
  }
}

export { CreateTransferController };
