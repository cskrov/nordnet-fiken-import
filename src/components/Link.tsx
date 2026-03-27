import type { FlowComponent } from 'solid-js';

interface Props {
  href: string;
}

export const Link: FlowComponent<Props> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);
