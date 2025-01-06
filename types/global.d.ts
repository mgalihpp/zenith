import type { JSX as Jsx } from 'react/jsx-runtime';

// Issue with react-markdown rc-19
declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass;
    type Element = Jsx.Element;
    type IntrinsicElements = Jsx.IntrinsicElements;
  }
}
