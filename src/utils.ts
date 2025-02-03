import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';

/**
 * Makes the rendered text + XML prompt a little prettier
 * using rehype-format.
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

  return String(file)
}