/**
 * Overrides default HTML element renderings.
 * @type {Object}
 */
export const htmlComponents = {
  p: (props: any) => props.children,
  ul: (props: any) => props.children,
  ol: (props: any) => props.children,
  li: (props: any) => `- ${props.children}`,
}