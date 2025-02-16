import type { FlowComponent } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { twMerge } from 'tailwind-merge';

export enum HeadingSize {
  XSMALL = -1,
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2,
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  level: HeadingLevel;
  size: HeadingSize;
  spacing?: boolean;
  centered?: boolean;
  className?: string;
  children: JSX.Element;
}

const BASE_CLASSES = 'flex flex-row items-center gap-x-1 font-bold';

export const Heading: FlowComponent<Props> = ({
  level,
  size = HeadingSize.MEDIUM,
  spacing = false,
  centered = false,
  className,
  children,
}) => {
  const variantClasses = `${BASE_CLASSES} ${centered ? 'justify-center' : 'justify-start'} ${FONT_SIZE[size]} ${spacing ? 'mb-4' : ''}`;
  const headingClasses = twMerge(variantClasses, className);

  switch (level) {
    case 1:
      return <h1 class={headingClasses}>{children}</h1>;
    case 2:
      return <h2 class={headingClasses}>{children}</h2>;
    case 3:
      return <h3 class={headingClasses}>{children}</h3>;
    case 4:
      return <h4 class={headingClasses}>{children}</h4>;
    case 5:
      return <h5 class={headingClasses}>{children}</h5>;
    case 6:
      return <h6 class={headingClasses}>{children}</h6>;
  }
};

const FONT_SIZE: Record<HeadingSize, string> = {
  [HeadingSize.XSMALL]: 'text-base',
  [HeadingSize.SMALL]: 'text-2xl',
  [HeadingSize.MEDIUM]: 'text-3xl',
  [HeadingSize.LARGE]: 'text-4xl',
};
