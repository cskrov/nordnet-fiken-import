import type { FlowComponent } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';

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
  children: JSX.Element;
}

export const Heading: FlowComponent<Props> = ({
  level,
  size = HeadingSize.MEDIUM,
  spacing = false,
  centered = false,
  children,
}) => {
  const style: JSX.CSSProperties = {
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'center',
    'column-gap': '0.25em',
    'margin-top': 0,
    'justify-content': centered ? 'center' : 'left',
    'font-size': fontSize(size),
    'margin-bottom': spacing ? '1em' : 0,
  };

  switch (level) {
    case 1:
      return <h1 style={style}>{children}</h1>;
    case 2:
      return <h2 style={style}>{children}</h2>;
    case 3:
      return <h3 style={style}>{children}</h3>;
    case 4:
      return <h4 style={style}>{children}</h4>;
    case 5:
      return <h5 style={style}>{children}</h5>;
    case 6:
      return <h6 style={style}>{children}</h6>;
  }
};

const fontSize = (size: HeadingSize) => {
  switch (size) {
    case HeadingSize.XSMALL:
      return '1rem';
    case HeadingSize.SMALL:
      return '1.5rem';
    case HeadingSize.MEDIUM:
      return '2rem';
    case HeadingSize.LARGE:
      return '2.5rem';
  }
};
