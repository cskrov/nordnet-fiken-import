import type { FikenLine } from "@app/lib/fiken";

export class AccountEvent extends Event {
  constructor(public readonly account: string, public readonly line: FikenLine) {
    super('account', { bubbles: true });
  }
}