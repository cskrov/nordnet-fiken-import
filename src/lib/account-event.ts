import type { FikenLine } from "@app/lib/fiken/types";

export const FROM_ACCOUNT_EVENT = 'from-account';

export class FromAccountEvent extends Event {
  constructor(public readonly account: string, public readonly line: FikenLine) {
    super(FROM_ACCOUNT_EVENT, { bubbles: true });
  }
}

export const TO_ACCOUNT_EVENT = 'to-account';

export class ToAccountEvent extends Event {
  constructor(public readonly account: string, public readonly line: FikenLine) {
    super(TO_ACCOUNT_EVENT, { bubbles: true });
  }
}
