import { Statement } from "../../entities/Statement";

export type ICreateTransferDTO =
Pick<
  Statement,
  'received_id' |
  'description' |
  'amount' |
  'type'
>
