import React from 'react';

type CustomHTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

// Custom tags we use in jsx-prompt components
type CustomTags =
  | 'variables'
  | 'variable'
  | 'instructions'
  | 'instruction'
  | 'chat-history'
  | 'user-input'
  | 'input-format'
  | 'examples'
  | 'purpose'
  | 'prompt'
  | 'today'
  | 'background'
  | 'example'
  | 'message'
  | 'output-format';

//adds all the custom tags to the JSX namespace
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends Record<CustomTags, CustomHTMLProps> {}
  }
}


// declare module 'react' {
//   namespace JSX {
//     interface IntrinsicElements {
//       [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//     }
//   }
// }