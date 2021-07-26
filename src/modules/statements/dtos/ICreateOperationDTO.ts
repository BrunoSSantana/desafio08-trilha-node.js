import { OperationType } from "../entities/Statement";

// export type ICreateStatementDTO =
// Pick<
//   Statement,
//   'received_id' |
//   'description' |
//   'amount' |
//   'type'
// >
interface ICreateOperationDTO {
  received_id: string;
  send_id?: string;
  description: string;
  amount: number;
  type: OperationType;
}
export { ICreateOperationDTO };
