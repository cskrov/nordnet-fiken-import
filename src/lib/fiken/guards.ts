import type { FikenLine, FikenLineInnskudd, FikenLineUttak } from "@app/lib/fiken/types";
import { NordnetType } from "@app/lib/nordnet/types";

export const isInnskuddLine = (line: FikenLine): line is FikenLineInnskudd => line.type === NordnetType.INNSKUDD;

export const isUttakLine = (line: FikenLine): line is FikenLineUttak => line.type === NordnetType.UTTAK;
