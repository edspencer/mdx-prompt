# mdx-prompt

![mdx-prompt logo](/docs/mdx-prompt-logo-wide.png)

`mdx-prompt` is a lightweight library enabling React (and MDX) developers to write large language model (LLM) prompts as JSX components. By defining your prompts in JSX or MDX, you can achieve a high degree of composability, reusability, and clarity for both simple and complex prompt designs.

Many developers end up piecing together a big template string for an LLM prompt. `mdx-prompt` offers an alternative by letting React generate those strings using familiar patterns: you create React components (or MDX files) that produce the final prompt. This approach can make your AI-driven features more maintainable, more testable, and more fun to code!

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Default Components and Usage](#default-components-and-usage)
   - [\<Prompt>](#prompt)
   - [\<Purpose>](#purpose)
   - [\<Instructions>](#instructions)
   - [\<Instruction>](#instruction)
   - [\<UserInput>](#userinput)
   - [\<Example> and \<Examples>](#example-and-examples)
   - [\<InputFormat>](#inputformat)
   - [\<OutputFormat>](#outputformat)
   - [\<ChatHistory>](#chathistory)
   - [\<Variables>](#variables)
   - [\<Data>](#data)
   - [\<Tools>](#tools)
5. [Rendering Prompts](#rendering-prompts)
   - [Using `renderMDX` (Inline Usage)](#using-rendermdx-inline-usage)
   - [Using `renderMDXPromptFile` (MDX File Usage)](#using-rendermdxpromptfile-mdx-file-usage)
   - [Full Example in a Next.js Route](#full-example-in-a-nextjs-route)
6. [Creating Your Own Components](#creating-your-own-components)
7. [JSDoc Reference and Examples](#jsdoc-reference-and-examples)
   - [1. `renderMDX()`](#1-rendermdx)
   - [2. `renderMDXPromptFile()`](#2-rendermdxpromptfile)
   - [3. `prettyPrompt()`](#3-prettyprompt)
8. [Example: Inline MDX Prompt in a Scorer](#example-inline-mdx-prompt-in-a-scorer)
9. [Challenges and Caveats](#challenges-and-caveats)
   - [React / Next.js Compatibility](#react--nextjs-compatibility)
   - [TypeScript Chores](#typescript-chores)
   - [HTML DOM Tag Hoisting Quirks](#html-dom-tag-hoisting-quirks)
   - [Non-Standard Import Flow](#non-standard-import-flow)
10. [Real-World Usage: Excerpts from bragdoc.ai](#real-world-usage-excerpts-from-bragdocai)
11. [Contributing](#contributing)
12. [License](#license)

---

## Features

- **Write prompts in JSX or MDX:** Use React components to build dynamic, structured, or even XML-like prompts in a readable way.
- **Composable prompt fragments:** Compose your prompts from smaller components, passing data around via props.  
- **Use MDX files or inline React** for your prompts; get the best of both worlds.
- **Works well in Next.js, Node.js CLIs, or custom React render flows:** If you can run React on the server to produce a string, you can run `mdx-prompt`.
- **Easily testable:** Thanks to the structured approach, you can feed your prompts mock data in tests and Evals.
- **Lightweight, minimal dependencies:** A small wrapper around `react-dom/server` plus some MDX support from `next-mdx-remote`.

---

## Installation

```bash
npm install mdx-prompt
# or
yarn add mdx-prompt
# or
pnpm add mdx-prompt
```

You will also need to ensure you have React 18+ installed (as a peer dependency).

---

## Core Concepts

### 1. Write prompts in React / MDX

Instead of building prompts with big strings, you define them in JSX or MDX:

```jsx
<Prompt>
  <Purpose>Generate a summary of the user's achievements.</Purpose>
  <Instructions>
    <Instruction>Be concise but comprehensive.</Instruction>
    <Instruction>Focus on the user's documented successes.</Instruction>
  </Instructions>
  <Variables>
    <UserInput>{data.userMessage}</UserInput>
    {/* You can add custom tags or use custom components, too */}
  </Variables>
</Prompt>
```

Then, `mdx-prompt` transforms that JSX/MDX into a final string suitable for sending to an LLM API.

### 2. Composability

`mdx-prompt` encourages a component-based approach. If you have repeated logic for (say) outputting user achievements, project metadata, or instructions, you can encapsulate them as separate React components. For instance:

```tsx
export function Company({ company }: { company: CompanyType }) {
  return (
    <company>
      <id>{company.id}</id>
      <name>{company.name}</name>
      ...
    </company>
  );
}
```

Then in your prompt:

```jsx
<Variables>
  <Company company={data.company} />
</Variables>
```

### 3. Mix structured and unstructured text

Your prompt can combine free text with structured sections (like XML or custom tags). This makes it easier to reason about your prompt, or pass it to another LLM for meta-processing.

---

## Default Components and Usage

`mdx-prompt` ships with a small set of default “prompt structure” components that you can optionally use. They are all exported from `mdx-prompt/src/components/prompt.tsx` (or just from the top-level package if you do `import { Prompt, Purpose, Instructions, ... } from 'mdx-prompt';`).

Below is an overview of each built-in component, how it renders, and typical usage. These are all extremely simple wrappers that produce custom tags, so feel free to customize or create your own.

### `<Prompt>`

**Signature**:
```tsx
export function Prompt({ children }: { children: React.ReactNode }) {
  return children;
};
```
A simple root component that doesn't transform or wrap your content in extra tags, but conceptually indicates "this is the entire prompt." You can nest `<Purpose>`, `<Instructions>`, `<Variables>`, and other sections inside it.

### `<Purpose>`

**Signature**:
```tsx
export function Purpose({ children }: { children: React.ReactNode }) {
  return <purpose>{children}</purpose>;
}
```
Usually near the top, it renders as `<purpose> ... </purpose>`. Use it to give an overall goal or summary of the prompt.

### `<Instructions>`

**Signature**:
```tsx
export function Instructions({
  instructions = [],
  children,
}: {
  instructions?: string[];
  children?: React.ReactNode;
}) {
  return (
    <instructions>
      {instructions.map((instruction) => (
        <Instruction
          key={instruction.replace(/\s/g, '')}
          dangerouslySetInnerHTML={{ __html: instruction }}
        />
      ))}
      {children}
    </instructions>
  );
}
```

Encapsulates a list of instructions. If you have a dynamic set of instructions (as an array of strings), pass them in via the `instructions` prop. Otherwise, you can nest `<Instruction>` children.

### `<Instruction>`

**Signature**:
```tsx
export function Instruction({
  children,
  dangerouslySetInnerHTML,
}: {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
}) {
  return (
    <instruction dangerouslySetInnerHTML={dangerouslySetInnerHTML}>
      {children}
    </instruction>
  );
}
```
Renders `<instruction>...</instruction>`. Typically used within `<Instructions>`.

### `<UserInput>`

**Signature**:
```tsx
export function UserInput({ children }: { children: React.ReactNode }) {
  return <user-input>{children}</user-input>;
}
```
Marks the user-supplied text or data to be processed by the LLM. Often a message or user string.

### `<Example>` and `<Examples>`

**Signature**:
```tsx
export function Example({ children }: { children: React.ReactNode }) {
  return <example>{children}</example>;
}

export function Examples({
  examples = [],
  children,
}: {
  examples?: string[];
  children?: React.ReactNode;
}) {
  return (
    <examples>
      {examples.map((example, i) => (
        <example key={i} dangerouslySetInnerHTML={{ __html: example }} />
      ))}
      {children}
    </examples>
  );
}
```
Used to provide reference examples or few-shot content. `<Examples>` can contain one or more `<Example>` items, or pass an array of strings to `examples`.

### `<InputFormat>`

**Signature**:
```tsx
export function InputFormat({
  children,
  title = 'You are provided with the following inputs:',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <input-format title={title}>{children}</input-format>;
}
```
Renders as `<input-format title="...">...</input-format>`. Typically used to show the user (or the LLM) what input fields or data have been provided.

### `<OutputFormat>`

**Signature**:
```tsx
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
```
Renders as `<output-format>`. Often used to specify how you want the LLM’s answer shaped or structured.

### `<ChatHistory>`

**Signature**:
```tsx
export function ChatHistory({ messages }: { messages: any[] }) {
  return (
    <chat-history>
      {messages?.map(({ role, content }) => (
        <message key={content.replace(/\s/g, '')}>
          {role}: {content}
        </message>
      ))}
    </chat-history>
  );
}
```
Simple utility to dump an array of messages into `<chat-history>...`. You can adapt as needed (for example, if you want each message to be `<assistant>` or `<user>` tags, etc.)

### `<Variables>`

**Signature**:
```tsx
export function Variables({ children }: { children: React.ReactNode }) {
  return <variables>{children}</variables>;
}
```
A container for any input data you want to pass, especially if it doesn’t neatly fit in other sections. Sometimes you might place `<ChatHistory>` inside `<Variables>`, or custom React components that render your domain data.

### `<Data>`

**Signature**:
```tsx
export function Data({ children }: { children: React.ReactNode }) {
  return <data>{children}</data>;
}
```
`<Data>` is now the preferred way of passing in data for prompt generation, replacing or complementing `<InputFormat>`. Use it to embed raw data (e.g., JSON) into your prompt. For example:

```jsx
<Variables>
  <Data>{JSON.stringify(data, null, 2)}</Data>
</Variables>
```

### `<Tools>`

**Signature**:
```tsx
export function Tools({ children }: { children: React.ReactNode }) {
  return <tools>{children}</tools>;
}
```
Use `<Tools>` to list tool instructions or capabilities that the LLM can utilize, such as integration points or helper functions. For instance:

```jsx
<Variables>
  <Tools>
    <Tool name="GitHub">Extract commit achievements</Tool>
    <Tool name="Slack">Send notification</Tool>
  </Tools>
</Variables>
```

---

## Rendering Prompts

### Using `renderMDX` (Inline Usage)

If you’re already in a `.ts` or `.tsx` file and want to define your prompt inline (rather than in a `.mdx` file), you can:

1. Create a React component that represents your prompt.
2. Pass that component to `renderMDX(...)`.

**Example** (adapted from a small CLI script):

```ts
import { renderMDX } from 'mdx-prompt';
import {
  Prompt, Purpose, Instructions
} from 'mdx-prompt';

(async () => {
  const MyPrompt = () => {
    return (
      <Prompt>
        <Purpose>To do something interesting</Purpose>
        <Instructions instructions={[
          'List key findings',
          'Prioritize bullet points by significance'
        ]} />
      </Prompt>
    );
  };

  const outputString = await renderMDX(<MyPrompt />);
  console.log(outputString);
})();
```

**Result (approximate):**

```xml
<purpose>To do something interesting</purpose>
<instructions>
  <instruction>List key findings</instruction>
  <instruction>Prioritize bullet points by significance</instruction>
</instructions>
```

### Using `renderMDXPromptFile` (MDX File Usage)

Often, you’ll want your LLM prompts in `.mdx` files, allowing for:

- Clear separation of text and code
- More sophisticated MDX flows
- Reuse in a variety of contexts (like test/Eval data, partial prompts, etc.)

Example `.mdx` file (`extract-achievements.mdx`):

```mdx
<Prompt>
  <Purpose>
    You are a careful and attentive assistant who extracts work achievements
    from user messages. Follow the instructions carefully.
  </Purpose>

  <Data>{JSON.stringify(data, null, 2)}</Data>
  
  <Tools>
    <Tool name="GitHub">Extract commit achievements</Tool>
    <Tool name="Slack">Send a notification</Tool>
  </Tools>
  
  <Instructions>
    <Instruction>Include a clear, action-oriented title for each achievement.</Instruction>
    <Instruction>Do not speculate or invent details.</Instruction>
  </Instructions>

  <Variables>
    <UserInput>{data.message}</UserInput>
  </Variables>
</Prompt>

Your answer:
```

Then in your code:

```ts
import { renderMDXPromptFile } from 'mdx-prompt';
import * as customElements from './my-custom-elements'; 
import path from 'path';

const promptPath = path.resolve(__dirname, './extract-achievements.mdx');

async function renderExtractAchievementsPrompt(data: {
  message: string;
  userId: string;
}) {
  const rendered = await renderMDXPromptFile({
    filePath: promptPath,
    data,
    components: {
      ...customElements,  // your custom React components, e.g. <Company />
    },
  });

  return rendered;
}

// usage
(async () => {
  const promptString = await renderExtractAchievementsPrompt({ 
    message: 'I deployed 3 new microservices last week', 
    userId: '123' 
  });
  console.log(promptString);
})();
```

### Full Example in a Next.js Route

Below is a sketch of how you might do this in a Next.js 15 route. Suppose you have a route at `app/api/prompts/[id]/route.ts` that returns rendered prompts. You can do:

```ts
import { NextResponse } from 'next/server';
import { renderMDXPromptFile } from 'mdx-prompt';
import * as components from '@/app/prompts/elements';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // e.g. /api/prompts/extract-achievements
  const { id } = params;
  let promptPath: string;
  let data: any = {};

  if (id === 'extract-achievements') {
    promptPath = path.resolve('./prompts/extract-achievements.mdx');
    data = {
      message: 'I built a new payment integration this week.'
    };
  } else {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }

  const promptString = await renderMDXPromptFile({
    filePath: promptPath,
    data,
    components
  });

  return new NextResponse(promptString, { status: 200, headers: {
    'Content-Type': 'text/plain'
  }});
}
```

Then open `[YourApp]/api/prompts/extract-achievements` in the browser and see the final rendered text.

---

## Full Example: Router LLM Prompt

Below is an almost-complete example of the LLM Router prompt used on [bragdoc.ai](https://bragdoc.ai) (a couple of the tools have been truncated for brevity).

This prompt is significantly large, but gives the LLM a well-structured set of instructions on how to complete the often very complex task of performing as a Router LLM.

Most prompts will be significantly simpler than this. Some sections like the lengthy Tool declarations could be extracted like any other React component and reused between different tool-calling LLMs (see the next section):

```mdx
<Purpose>
  You are a friendly assistant for bragdoc.ai, which helps users keep a brag document about their achievements at work, as a basis for later generation of performance review documents and weekly summaries for their managers.
  You help users track their Achievements at work, and generate weekly/monthly/performance review documents.

  You are acting as the Router LLM for bragdoc.ai, so you will receive the whole chat history between yourself and the user, and your job is to act on the most recent message from the user.
</Purpose>

<Background>
This application allows users to log their Achievements at work, organizing them by project and company.
The Achievement data is later used to generate weekly/monthly/performance review documents.
</Background>

Here are the relevant parts of the database schema:

<schema>
  <table name="Achievement">
    <column name="id" type="uuid" />
    <column name="title" type="string" />
    <column name="description" type="string" />
    <column name="date" type="date" />
    <column name="companyId" type="uuid" />
    <column name="projectId" type="uuid" />
    <column name="eventStart" type="date" />
    <column name="eventEnd" type="date" />
    <column name="impact" type="number" desc="1, 2, or 3 where 3 is high impact" />
    <column name="impactSource" type="string" desc="Impact rated by user or llm" />
  </table>
  <table name="Company">
    <column name="id" type="uuid" />
    <column name="name" type="string" />
  </table>
  <table name="Project">
    <column name="id" type="uuid" />
    <column name="name" type="string" />
  </table>
</schema>

<Instructions>
  <Instruction>Keep your responses concise and helpful.</Instruction>
  <Instruction>If the user tells you about things they've done at work, call the extractAchievements tool.</Instruction>
  <Instruction>When the user asks you to generate a report, call the createDocument tool (you will be given the Achievements, Companies and Projects data that you need).</Instruction>
  <Instruction>Only call the extractAchievements tool once if you detect any number of Achievements in the chat message you examine - the tool will extract all of the achievements in that message and return them to you</Instruction>
</Instructions>

You will be given the following data:

<InputFormat>
  <chat-history>The chat history between the user and the chatbot</chat-history>
  <user-input>The message from the user</user-input>
  <companies>All of the companies that the user works at (or has worked at)</companies>
  <projects>All of the projects that the user works on (or has worked on)</projects>
  <today>Today&apos;s date</today>
</InputFormat>

These are the tools available to you. It may be appropriate to call one or more tools, potentially in a certain order. Other times it will not be necessary to call any tools, in which case you should just reply as normal:

<Tools>
  <Background>
    Blocks is a special user interface mode that helps users with writing, editing, and other content creation tasks.
    When block is open, it is on the right side of the screen, while the conversation is on the left side.
    When creating or updating documents, changes are reflected in real-time on the blocks and visible to the user.
    This is a guide for using blocks tools: \`createDocument\` and \`updateDocument\`, 
    which render content on a blocks beside the conversation.
  </Background>
  <Tool>
    <name>extractAchievements</name> 
    <summary>call this tool if the user tells you about things they've done at work. The extractAchievements tool will automatically be passed the user's message, companies and projects, but as you have also been given the projects and companies, please pass extractAchievements the appropriate companyId and/or projectId, if applicable. A user may be talking about Achievements not linked to a project.</summary>

    <when-to-use>
      **When to use extractAchievements:**
      - When the user is telling you about things they've done at work
      - When the user provides an update to an existing Achievement
      - Only call the extractAchievements tool once. Do not pass it any arguments
      - extractAchievements already has the full conversation history and will use it to generate Achievements
    </when-to-use>


    <when-not-to-use>
    **When NOT to use extractAchievements:**
    - When the user is requesting information about existing Achievements
    - When the user is requesting information about existing documents
    </when-not-to-use>
  </Tool>
  ... more tools here
  <Tool>
    <name>createProject</name>
    <summary>Creates a new Project</summary>

    <when-to-use>
      Call this tool if the user either explicitly asks you to create a new project, or if it is clear from the context that the user would like you to do so. For example, if the user says "I started a new project called Project Orion today, so far I got the website skeleton in place and basic auth too", you should create a new project called Project Orion, before calling extractAchievements
    </when-to-use>
  </Tool>
</Tools>

Here are some examples of messages from the user and the tool selection or response you should make:

<Examples>
  <Example>
    User: I fixed up the bugs with the autofocus dashboard generation and we launched autofocus version 2.1 this morning.
    Router LLM: Call extractAchievements tool
  </Example>
  <Example>
    User: Write a weekly report for my work on Project X for the last 7 days.
    Router LLM: Call createDocument tool, with the days set to 7, and the correct projectId and companyId
  </Example>
  <Example>
    User: I started a new project called Project Orion today, so far I got the website skeleton in place and basic auth too. Please create a new project called Project Orion and call extractAchievements
    Router LLM: Call createProject tool, and then call extractAchievements tool
  </Example>
</Examples>

Here now are the actual data for you to consider:

<Data>
  <ChatHistory messages={data.chatHistory} />
  <today>{new Date().toLocaleDateString()}</today>
  <Companies companies={data.companies} />
  <Projects projects={data.projects} />
  <UserInput>{data.message}</UserInput>
</Data>

Your response:
```

This example illustrates how to integrate data and tool instructions within an MDX prompt for enhanced LLM routing.

---

## Creating Your Own Components

To embed your own domain logic, define React components that output custom tags or text. For instance, if you need a `<Company>` tag repeated for each company:

```tsx
// my-custom-elements.ts
import React from 'react';

export function Company({ company }: { company: CompanyType }) {
  return (
    <company>
      <id>{company.id}</id>
      <name>{company.name}</name>
      <role>{company.role}</role>
      {/* ... More fields */}
    </company>
  );
}

export function Companies({ companies }: { companies: CompanyType[] }) {
  return (
    <companies>
      {companies.map((c) => (
        <Company key={c.id} company={c} />
      ))}
    </companies>
  );
}
```

In your `.mdx` or JSX:
```mdx
<Variables>
  <Companies companies={data.companies} />
</Variables>
```

At runtime, React will convert these components into strings, ultimately producing something like:

```xml
<companies>
  <company>
    <id>ACME-123</id>
    <name>ACME Corp</name>
    <role>Lead Engineer</role>
  </company>
  ...
</companies>
```

---

## JSDoc Reference and Examples

Below are snippets of the JSDoc that you can find throughout the `mdx-prompt` codebase. We encourage you to scan the source for more details (the code is minimal and quite approachable).

### 1. `renderMDX()`

From [`src/render.ts`](./src/render.ts):

```ts
/**
 * Renders MDX content using the default render function and returns the pretty-printed HTML.
 * @param {React.ReactElement} mdxSource - The MDX source element.
 * @returns {string} - The pretty-printed HTML output.
 */
export async function renderMDX(mdxSource: React.ReactElement) {
  return prettyPrompt(renderToStaticMarkup(mdxSource));
}
```

- **Description**: Renders a React element to static markup (using `react-dom/server`) and then runs it through a formatter so it’s more readable.  
- **Use Case**: Inline usage or small prompts that are directly declared as React components in the same file.

### 2. `renderMDXPromptFile()`

From [`src/render.ts`](./src/render.ts):

```ts
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
```

- **Description**: The main entry point for reading an `.mdx` file off disk, injecting data into its scope, and returning the final string.  
- **Use Case**: More robust or multi-file setups, or for prompts that heavily rely on Markdown/MDX.  

### 3. `prettyPrompt()`

From [`src/utils.ts`](./src/utils.ts):

```ts
/**
 * Makes the rendered text + XML prompt a little prettier
 * using rehype-format.
 * @param {string} rawHtml - The raw HTML string to format.
 * @returns {string} - The formatted HTML string.
 */
export function prettyPrompt(rawHtml: string): string {
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .processSync(rawHtml);

  return String(file).replace(/^\n/, '');
}
```

- **Description**: Uses the `rehype` ecosystem to prettify the resulting HTML/XML. This is purely cosmetic to help debug or log your final prompts.  
- **Use Case**: Typically called from `renderMDX()` or `renderMDXPromptFile()` internally. You won’t often call it directly.

---

## Example: Inline MDX Prompt in a Scorer

Below is an example of embedding an inline `<Prompt>` inside a TypeScript function that uses `renderMDX` to compare two sets of data with an LLM. This excerpt is from a real-world “LLM as a judge” scenario:

```tsx
import { LLMClassifierFromSpec, type Score } from 'autoevals';
import { renderMDX } from 'mdx-prompt';
import {
  Prompt,
  Purpose,
  Instructions,
  InputFormat,
  OutputFormat,
  Variables
} from 'mdx-prompt/components';

const outputFormat = `
(A) Perfect match
(B) Good but missing details
(C) Minor issues
(D) Major issues
(E) Completely wrong
`;

const instructions = [
  'Compare the arrays carefully and decide how close they match.',
  'Do not add anything beyond what the user said.'
];

function EvaluatePromptComparison({
  expected,
  output,
}: {
  expected: any;
  output: any;
}) {
  return (
    <Prompt>
      <Purpose>
        Compare the extracted achievements with the expected results.
      </Purpose>
      <Instructions instructions={instructions} />
      <InputFormat>
        <expected>All items that should have been extracted</expected>
        <extracted>All items that were actually extracted</extracted>
      </InputFormat>
      <OutputFormat format={`Answer with a single letter: ${outputFormat}`} />
      <Variables>
        <expected>{JSON.stringify(expected, null, 4)}</expected>
        <extracted>{JSON.stringify(output, null, 4)}</extracted>
      </Variables>
    </Prompt>
  );
}

export async function AchievementsScorer(args: any): Promise<Score> {
  const prompt = await renderMDX(
    <EvaluatePromptComparison
      expected={args.expected}
      output={args.output}
    />
  );

  return LLMClassifierFromSpec('AchievementsScorer', {
    prompt,
    choice_scores: {
      A: 1.0,
      B: 0.8,
      C: 0.6,
      D: 0.3,
      E: 0.0,
    },
  })(args);
}
```

Here, we define a small React component `<EvaluatePromptComparison>` that is rendered via `renderMDX(...).` The final string is then passed to an LLM for classification. This pattern allows your prompt to be just as composable as any other piece of React code.

---

## Challenges and Caveats

### React / Next.js Compatibility

- **Partial RSC Incompatibility**: In Next.js 15 with React Server Components (RSC), trying to render your MDX or JSX prompt to a string inside an RSC can be tricky or disallowed. A common workaround is to fetch your prompt text via a route or a separate function and feed that into your RSC.  
- **Version Mismatches**: If your Next.js app uses a locked React version, you might run into version conflicts. Double-check your `react`/`react-dom` versions.

### TypeScript Chores

- **Custom Tags**: If you use XML-like tags (`<company>`, `<project>`, etc.), TypeScript will complain that these are not standard HTML elements. You must add them as `IntrinsicElements` in a `.d.ts` file. A typical approach:
  ```ts
  // global.d.ts
  import React from 'react';
  type CustomTags = 'purpose' | 'instructions' | 'instruction' 
                   | 'company' | 'project' | 'user-input' /* etc. */;

  declare module 'react' {
    namespace JSX {
      interface IntrinsicElements extends Record<CustomTags, any> {}
    }
  }
  ```
- **No Perfect Type Checking for `.mdx`**: Because we compile `.mdx` dynamically, references to `data.foo` might not get fully type-checked. Usually you can mitigate by carefully matching your known shape in code, but it’s not “strict typed.”

### HTML DOM Tag Hoisting Quirks

React’s rendering logic occasionally hoists or merges certain tags (like `<title>`, `<meta>`). If you try to use these in an MDX prompt, the final string might differ from what you expect. Use custom tags instead (`<doc-title>` or `<prompt-title>`) to avoid special React DOM behaviors.

### Non-Standard Import Flow

You typically have to read `.mdx` from the filesystem (e.g., `fs.readFileSync(...)`) or rely on `renderMDXPromptFile(...)`. Some bundlers or dev environments may not be aware that `.mdx` files are required, potentially skipping them. Usually a direct path reference solves it, but it’s a pattern worth noting.

---

## Real-World Usage: Excerpts from bragdoc.ai

The [bragdoc.ai](https://bragdoc.ai) project uses `mdx-prompt` for:

- **Extracting achievements from plain text** (`extract-achievements.mdx`).
- **Extracting achievements from git commits** (`extract-commit-achievements.mdx`).
- **Generating weekly/monthly documents** (`generate-document.mdx`).

Within bragdoc.ai, each `.mdx` file is accompanied by a TypeScript “orchestrator” that:

1. Fetches relevant data (projects, companies, user settings).  
2. Renders the `.mdx` file with those data.  
3. Sends the final string to the LLM (like GPT-4).  
4. Receives structured JSON back, updates the DB.

This pattern highlights how you can combine:

- Clear separation of “prompt definition” in `.mdx`
- Domain data loading in a separate function
- Reusable React components that produce XML-like prompt sections

The result is a well-organized codebase and easily tested flows.

---

## Contributing

We welcome contributions in the form of bug reports, feature requests, or pull requests. Feel free to open an issue or PR in our [GitHub repository](https://github.com/edspencer/mdx-prompt).

Steps to get started developing locally:

1. Clone the repo  
2. `npm install` or `pnpm install`  
3. Make changes  
4. Run `npm run build` to ensure builds pass  
5. Submit a PR  

---

## License

[MIT License](./LICENSE.md)

```
MIT License

Copyright (c) 2025 Ed Spencer

Permission is hereby granted, free of charge...
```

---

**We hope `mdx-prompt` makes your LLM prompts more enjoyable to write, maintain, and test!** If you have any questions or find interesting use cases, please share an issue or discussion on [GitHub](https://github.com/edspencer/mdx-prompt).

Happy prompting!