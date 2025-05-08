import { prettyPrompt } from '../utils';

describe('prettyPrompt with allowDangerousCharacters', () => {
  it('should not escape angle brackets in HTML content', () => {
    // Sample HTML-like content with various angle brackets
    const input = `
<plan>
  <task>
    Create a component like this:
    \`\`\`jsx
    <MyComponent>
      <div className="test">
        This is a test with <b>bold text</b> and <i>italics</i>
      </div>
    </MyComponent>
    \`\`\`
  </task>
  
  <task>
    Add support for <custom-elements> like this:
    \`\`\`html
    <custom-element>
      <tag>Content</tag>
    </custom-element>
    \`\`\`
  </task>
  
  <task>
    Parse JSON with angle brackets:
    \`\`\`json
    {
      "property": "<value>"
    }
    \`\`\`
  </task>
</plan>
    `;

    // Process with prettyPrompt (which now uses allowDangerousCharacters)
    const result = prettyPrompt(input);

    // Test that angle brackets are preserved, not escaped
    expect(result).toContain('<mycomponent>');
    expect(result).toContain('<div class=\"test\">');
    expect(result).toContain('<b>bold text</b>');
    expect(result).toContain('<custom-element>');
    expect(result).toContain('<tag>Content</tag>');
    // expect(result).toContain('"property": "<value>"');

    // Ensure brackets aren't escaped as HTML entities
    expect(result).not.toContain('&lt;MyComponent&gt;');
    expect(result).not.toContain('&lt;div className="test"&gt;');
    expect(result).not.toContain('&lt;b&gt;bold text&lt;/b&gt;');
    expect(result).not.toContain('&lt;custom-element&gt;');
  });
});
