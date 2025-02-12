/**
 * prompt.tsx
 *
 * This file defines the core "prompt" components exported by mdx-prompt,
 * with comprehensive JSDoc comments and sample usage for each of the tags.
 *
 * SAMPLE USAGE (inline JSX):
 *
 * ```tsx
 * import React from 'react';
 * import {
 *   Prompt,
 *   Purpose,
 *   Background,
 *   Variables,
 *   Instructions,
 *   Instruction,
 *   UserInput,
 *   Example,
 *   Examples,
 *   InputFormat,
 *   OutputFormat,
 *   ChatHistory
 * } from './prompt';
 *
 * export function MyPrompt({ userMessage }: { userMessage: string }) {
 *   return (
 *     <Prompt>
 *       <Purpose>
 *         Your task is to analyze the user’s data and return a structured result.
 *       </Purpose>
 *
 *       <Background>
 *         The user has been providing daily updates on their project progress.
 *         We want to summarize these updates.
 *       </Background>
 *
 *       <Instructions instructions={['Be concise', 'Focus on metrics if possible']}>
 *         <Instruction>Avoid speculation or guesswork</Instruction>
 *       </Instructions>
 *
 *       <Variables>
 *         <UserInput>{userMessage}</UserInput>
 *       </Variables>
 *
 *       <InputFormat>
 *         The input consists of a single user message describing their achievements.
 *       </InputFormat>
 *
 *       <OutputFormat format="Output a summary with bullet points">
 *         Please respond with structured JSON if possible.
 *       </OutputFormat>
 *
 *       <Examples examples={[
 *         'Implemented a caching layer that reduced latency by 40%',
 *         'Refactored logging service to handle 2x traffic'
 *       ]}>
 *         <Example>
 *           Managed to fix 3 critical security vulnerabilities within 24 hours.
 *         </Example>
 *       </Examples>
 *     </Prompt>
 *   );
 * }
 * ```
 */

import React from 'react';

/**
 * The <Prompt> component serves as the logical "root" of your prompt.
 * It does not render an additional wrapper tag; it simply returns its children as-is.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child nodes containing all other sections of your prompt.
 *
 * @example
 * ```tsx
 * <Prompt>
 *   <Purpose>...</Purpose>
 *   <Instructions>...</Instructions>
 *   <Variables>...</Variables>
 * </Prompt>
 * ```
 */
export function Prompt({ children }: { children: React.ReactNode }) {
  return children;
}

/**
 * The <Purpose> component renders a <purpose> XML-like tag.
 * Typically used to indicate the overall goal or intention of the prompt.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The text or elements describing the prompt's purpose.
 *
 * @example
 * ```tsx
 * <Purpose>
 *   You are a top-tier editorial assistant. Improve the user's text for clarity and style.
 * </Purpose>
 * ```
 */
export function Purpose({ children }: { children: React.ReactNode }) {
  return <purpose>{children}</purpose>;
}

/**
 * The <Background> component renders a <background> tag,
 * usually containing contextual info or a summary of the scenario
 * the LLM should consider when responding.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The textual or element-based context describing the background scenario.
 *
 * @example
 * ```tsx
 * <Background>
 *   User wants to automate daily updates about project X. They have used Slack messages previously.
 * </Background>
 * ```
 */
export function Background({ children }: { children: React.ReactNode }) {
  return <background>{children}</background>;
}

/**
 * The <Variables> component renders a <variables> tag.
 * Commonly used to include dynamic or structured data that the LLM should consider.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The data or subcomponents that represent your prompt's variables.
 *
 * @example
 * ```tsx
 * <Variables>
 *   <UserInput>{userMessage}</UserInput>
 *   <Company company={selectedCompany} />
 * </Variables>
 * ```
 */
export function Variables({ children }: { children: React.ReactNode }) {
  return <variables>{children}</variables>;
}

/**
 * The <Data> component renders a <data> tag.
 * Commonly used to include dynamic or structured data that the LLM should consider.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The data or subcomponents that represent your prompt's variables.
 * @param {string} [props.title] - Optional title attribute for the <data> tag.
 *
 * @example
 * ```tsx
 * <Data title="User Input">
 *   <UserInput>{userMessage}</UserInput>
 *   <Company company={selectedCompany} />
 * </Data>
 * ```
 */
export function Data({
  children,
  title = 'You are provided with the following data:',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <data title={title}>{children}</data>;
}

/**
 * The <Tools> component renders a <tools> tag.
 * Commonly used to include dynamic or structured data that the LLM should consider.
 *
 * If you are sending tools to an LLM using something like the Vercel AI SDK,
 * and especially if you are using structured responses in your LLM calls, the
 * LLM will already be receiving the signatures of all of the tools at separately
 * so you probably don't need to go into that detail here.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The data or subcomponents that represent your prompt's tools.
 * @param {string} [props.title] - Optional title attribute for the <tools> tag.
 *
 * @example
 * ```tsx
 * <Tools title="User Input">
 *   <Tool>createDocument: choose this if the user wants to generate a report.</Tool>
 *   <Tool>extractAchievements: choose this if the user wants to log their achievements.</Tool>
 * </Data>
 * ```
 */
export function Tools({
  children,
  title = 'You are provided with the following tools:',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <tools title={title}>{children}</tools>;
}

/**
 * The <Tool> component renders an <tool> tag.
 * Often used inside <Tools>, but can be used standalone as well.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - The text or content of the tool.
 * @param {object} [props.dangerouslySetInnerHTML] - Optionally set HTML content directly.
 *
 * @example
 * ```tsx
 * <Tool>createDocument: choose this if the user wants to generate a report.</Tool>
 * ```
 */
export function Tool({
  children,
  dangerouslySetInnerHTML,
}: {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
}) {
  return <tool dangerouslySetInnerHTML={dangerouslySetInnerHTML}>{children}</tool>;
}

/**
 * The <Instructions> component renders a <instructions> tag
 * and can map an array of instruction strings to multiple <Instruction> tags.
 * You may also nest <Instruction> elements as children.
 *
 * @param {object} props
 * @param {string[]} [props.instructions] - An array of instruction strings automatically wrapped in <Instruction>.
 * @param {React.ReactNode} [props.children] - Additional children, which can include <Instruction> elements or other markup.
 *
 * @example
 * ```tsx
 * <Instructions instructions={[
 *   'Use bullet points when listing features',
 *   'Do not include personal opinions'
 * ]}>
 *   <Instruction>Write the response in Spanish</Instruction>
 * </Instructions>
 * ```
 */
export function Instructions({ instructions = [], children }: { instructions?: string[]; children?: React.ReactNode }) {
  return (
    <instructions>
      {instructions.map(instruction => (
        <Instruction key={instruction.replace(/\s/g, '')} dangerouslySetInnerHTML={{ __html: instruction }} />
      ))}
      {children}
    </instructions>
  );
}

/**
 * The <Instruction> component renders an <instruction> tag.
 * Often used inside <Instructions>, but can be used standalone as well.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - The text or content of the instruction.
 * @param {object} [props.dangerouslySetInnerHTML] - Optionally set HTML content directly.
 *
 * @example
 * ```tsx
 * <Instruction>Always output valid JSON</Instruction>
 * ```
 */
export function Instruction({
  children,
  dangerouslySetInnerHTML,
}: {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
}) {
  return <instruction dangerouslySetInnerHTML={dangerouslySetInnerHTML}>{children}</instruction>;
}

/**
 * The <UserInput> component renders a <user-input> tag,
 * typically containing the raw user message or query to be processed by the LLM.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The user's raw input or an equivalent data representation.
 *
 * @example
 * ```tsx
 * <UserInput>{userMessage}</UserInput>
 * ```
 */
export function UserInput({ children }: { children: React.ReactNode }) {
  return <user-input>{children}</user-input>;
}

/**
 * The <Example> component renders an <example> tag,
 * typically used to show a single example input or output in your prompt.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The example text or structured snippet.
 *
 * @example
 * ```tsx
 * <Example>
 *   Implemented a caching layer to reduce load times by 40%.
 * </Example>
 * ```
 */
export function Example({ children }: { children: React.ReactNode }) {
  return <example>{children}</example>;
}

/**
 * The <Examples> component renders an <examples> tag.
 * It can accept an array of example strings via the `examples` prop,
 * and/or nested <Example> components as children.
 *
 * @param {object} props
 * @param {string[]} [props.examples] - An array of string examples; each is automatically wrapped in <example> tags.
 * @param {React.ReactNode} [props.children] - Additional child nodes (often more <Example> elements).
 *
 * @example
 * ```tsx
 * <Examples examples={[
 *   'Deployed feature A, reducing error rate by 20%',
 *   'Refactored the user login system for better maintainability'
 * ]}>
 *   <Example>
 *     Improved database indexing, cutting query times in half.
 *   </Example>
 * </Examples>
 * ```
 */
export function Examples({ examples = [], children }: { examples?: string[]; children?: React.ReactNode }) {
  return (
    <examples>
      {examples.map((example, i) => (
        <example key={i} dangerouslySetInnerHTML={{ __html: example }} />
      ))}
      {children}
    </examples>
  );
}

/**
 * The <InputFormat> component renders an <input-format> tag,
 * usually describing how the LLM input data is structured or what the user is providing.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The textual explanation or sub-tags describing input structure.
 * @param {string} [props.title='You are provided with the following inputs:'] - Optional title attribute for <input-format>.
 *
 * @example
 * ```tsx
 * <InputFormat>
 *   The user has shared a summary of their recent work tasks:
 * </InputFormat>
 * ```
 */
export function InputFormat({
  children,
  title = 'You are provided with the following inputs:',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <input-format title={title}>{children}</input-format>;
}

/**
 * The <OutputFormat> component renders an <output-format> tag,
 * typically describing how the LLM should shape its response.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - Any text or further specification describing the format.
 * @param {string} [props.title='Your response should be formatted as:'] - Title attribute for <output-format>.
 * @param {string} [props.format=''] - An optional string to show a short reference format or instructions.
 *
 * @example
 * ```tsx
 * <OutputFormat format="Respond in JSON with a 'summary' field and an optional 'details' field.">
 *   Please keep the overall tone professional and concise.
 * </OutputFormat>
 * ```
 */
export function OutputFormat({
  children,
  title = 'Your response should be formatted as:',
  format = '',
}: {
  children?: React.ReactNode;
  title?: string;
  format?: string;
}) {
  return (
    <output-format title={title}>
      {children} {format}
    </output-format>
  );
}

/**
 * The <ChatHistory> component renders a <chat-history> tag,
 * listing messages as <message> sub-elements with "role: content".
 *
 * @param {object} props
 * @param {{ role: string; content: string }[]} props.messages - An array of message objects with "role" and "content".
 *
 * @example
 * ```tsx
 * const messages = [
 *   { role: 'system', content: 'You are a helpful AI assistant.' },
 *   { role: 'user', content: 'Hello!' }
 * ];
 *
 * <ChatHistory messages={messages} />
 * ```
 */
export function ChatHistory({ messages }: { messages: { role: string; content: string }[] }) {
  return (
    <chat-history>
      {messages?.map(({ role, content }) => (
        <message key={JSON.stringify(content).replace(/\s/g, '')}>
          {role}: {JSON.stringify(content, null, 4)}
        </message>
      ))}
    </chat-history>
  );
}
