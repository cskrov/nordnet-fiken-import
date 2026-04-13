import { type Component, mergeProps } from 'solid-js';

export enum VersionSize {
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2,
}

const SIZE: Record<VersionSize, string> = {
  [VersionSize.SMALL]: 'text-sm px-1 py-0.5 rounded-sm',
  [VersionSize.MEDIUM]: 'text-base px-2 py-1 rounded-md',
  [VersionSize.LARGE]: 'text-base px-3 py-1.5 rounded-lg',
};

interface Props {
  title?: string;
  /**
   * @default VersionSize.MEDIUM
   */
  size?: VersionSize;
}

export const Version: Component<Props> = (rawProps) => {
  const props = mergeProps({ size: VersionSize.MEDIUM }, rawProps);

  return (
    <span class={`${SIZE[props.size]} bg-gray-700 font-mono`} title={props.title}>
      {__APP_VERSION__.slice(0, 7)}
    </span>
  );
};
