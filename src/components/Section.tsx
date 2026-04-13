import { type FlowComponent, mergeProps } from 'solid-js';

export enum SectionVariant {
  PRIMARY = 0,
  SECONDARY = 1,
  SURFACE = 2,
  INACTIVE = 3,
}

interface Props {
  variant?: SectionVariant;
}

export const Section: FlowComponent<Props> = (rawProps) => {
  const props = mergeProps({ variant: SectionVariant.PRIMARY }, rawProps);

  return (
    <section class={`flex flex-col gap-y-4 p-4 rounded-lg ${BACKGROUND_COLOR[props.variant]}`}>
      {props.children}
    </section>
  );
};

const BACKGROUND_COLOR: Record<SectionVariant, string> = {
  [SectionVariant.PRIMARY]: 'bg-primary-800',
  [SectionVariant.SECONDARY]: 'bg-secondary-800',
  [SectionVariant.SURFACE]: 'bg-surface-800',
  [SectionVariant.INACTIVE]: 'bg-surface-400',
};
