import type { FlowComponent } from 'solid-js';

interface Props {
  href: string;
}

export const Link: FlowComponent<Props> = (props) => (
  <a href={props.href} target="_blank" rel="noreferrer">
    {props.children}
  </a>
);
