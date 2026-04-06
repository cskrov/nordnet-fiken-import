import type { Component } from 'solid-js';

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

export const Version: Component<Props> = ({ title, size = VersionSize.MEDIUM }) => (
  <span class={`${SIZE[size]} bg-gray-700 font-mono`} title={title}>
    {__APP_VERSION__.slice(0, 7)}
  </span>
);
