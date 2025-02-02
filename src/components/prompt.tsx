type PromptProps = {
  children?: React.ReactNode;
};

export const Prompt: React.FC<PromptProps> = ({ children }) => {
  return children;
};

export function Purpose({ children }: { children: React.ReactNode }) {
  return <purpose>{children}</purpose>;
}

export function Background({ children }: { children: React.ReactNode }) {
  return <background>{children}</background>;
}

export function Variables({ children }: { children: React.ReactNode }) {
  return <variables>{children}</variables>;
}

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

export function UserInput({ children }: { children: React.ReactNode }) {
  return <user-input>{children}</user-input>;
}

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

export function InputFormat({
  children,
  title = 'You are provided with the following inputs:',
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <input-format title={title}>{children}</input-format>;
}

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
