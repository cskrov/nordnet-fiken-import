import type { FikenLine, FikenLineInnskudd, FikenLineUttak } from '@app/lib/fiken/types';
import { NordnetType } from '@app/lib/nordnet/types';
import type { Accessor } from 'solid-js';

const isInnskuddLine = (line: FikenLine): line is FikenLineInnskudd => line.type === NordnetType.INNSKUDD;
export const isInnskuddLineAccessor = (line: Accessor<FikenLine>): line is Accessor<FikenLineInnskudd> =>
  isInnskuddLine(line());

const isUttakLine = (line: FikenLine): line is FikenLineUttak => line.type === NordnetType.UTTAK;
export const isUttakLineAccessor = (line: Accessor<FikenLine>): line is Accessor<FikenLineUttak> => isUttakLine(line());
