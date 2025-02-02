import fs from 'node:fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';

import * as promptComponents from './components/prompt';
import * as htmlComponents from './components/html';

import { prettyPrompt } from './utils';

/**
 * Renders MDX content using the default render function and returns the pretty-printed HTML.
 * @param {React.ReactElement} mdxSource - The MDX source element.
 * @returns {string} - The pretty-printed HTML output.
 */
export async function renderMDX(mdxSource: React.ReactElement) {
  return prettyPrompt(renderToStaticMarkup(mdxSource));
}

/**
 * Options for rendering MDX prompt files.
 * @typedef {Object} RenderOptions
 * @property {string} filePath - Path to the MDX file.
 * @property {any} [data] - Optional data to inject into MDX.
 * @property {any} [components] - Optional components to customize MDX rendering.
 */
export interface RenderOptions {
  filePath: string;
  data?: any;
  components?: any;
}

/**
 * Compiles a MDX prompt file and renders it using the default render function.
 * @param {RenderOptions} options - Options for rendering including filePath, and optional data/components.
 * @returns {Promise<string>} - The rendered and pretty-printed HTML string.
 */
export async function renderMDXPromptFile(options: RenderOptions) {
  const { filePath, data, components } = options;

  const content = await compileMDXPromptFile(filePath, data, components);

  return renderMDX(content);
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