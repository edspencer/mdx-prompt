import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';

import fs from 'node:fs';
import { compileMDX } from 'next-mdx-remote/rsc';

import * as promptComponents from './components/prompt';
import * as htmlComponents from './components/html';

/**
 * Pretty prints the provided HTML using rehype-format.
 * @param {string} rawHtml - The raw HTML string to format.
 * @returns {string} - The formatted HTML string.
 */
export function prettyPrompt(rawHtml: string): string {
  const file = unified()
    // parse as an “HTML fragment”
    .use(rehypeParse, { fragment: true })
    // apply standard formatting rules
    .use(rehypeFormat)
    // serialize back to HTML
    .use(rehypeStringify)
    .processSync(rawHtml);

  return String(file);
}

/**
 * Compiles a MDX file with optional data and components injected into its scope.
 * @param {string} filePath - The path to the MDX file.
 * @param {any} [data] - Optional data for the MDX scope.
 * @param {any} [components] - Optional components to override the defaults.
 * @returns {Promise<string>} - The compiled MDX content as a string.
 */
export async function compileMDXPromptFile(filePath: string, data?: any, components?: any) {
  const mdxSource = fs.readFileSync(filePath, 'utf-8');

  const { content } = await compileMDX({
    source: mdxSource,
    components: {
      ...htmlComponents,
      ...promptComponents,
      ...components,
    },
    options: {
      scope: {
        data,
      },
    },
  });

  return content;
}

/**
 * Renders MDX content using a provided render function and returns the pretty-printed HTML.
 * @param {React.ReactElement} mdxSource - The MDX source element.
 * @param {(mdxSource: React.ReactElement) => string} renderFn - The function that renders the MDX content.
 * @returns {string} - The pretty-printed HTML output.
 */
export async function renderMDX(
  mdxSource: React.ReactElement,
  renderFn: (mdxSource: React.ReactElement) => string
) {
  return prettyPrompt(renderFn(mdxSource));
}

/**
 * Options for rendering MDX prompt files.
 * @typedef {Object} RenderOptions
 * @property {(mdxSource: React.ReactElement) => string} renderFn - The render function for MDX.
 * @property {string} filePath - Path to the MDX file.
 * @property {any} [data] - Optional data to inject into MDX.
 * @property {any} [components] - Optional components to customize MDX rendering.
 */
export interface RenderOptions {
  renderFn: (mdxSource: React.ReactElement) => string;
  filePath: string;
  data?: any;
  components?: any;
}

/**
 * Compiles a MDX prompt file and renders it using the provided render function.
 * @param {RenderOptions} options - Options for rendering including filePath, renderFn and optional data/components.
 * @returns {Promise<string>} - The rendered and pretty-printed HTML string.
 */
export async function renderMDXPromptFile(options: RenderOptions) {
  const { renderFn, filePath, data, components } = options;

  const content = await compileMDXPromptFile(filePath, data, components);

  return renderMDX(content, renderFn);
}
