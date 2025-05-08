import fs from 'node:fs';
import path from 'node:path';
import { renderMDXPromptFile } from '../render';

// Test renders implement-plan.mdx with contents from plan.txt
describe('renderMDXPromptFile with HTML content', () => {
  it('should render the plan without escaping angle brackets', async () => {
    // Get paths to test files
    const planPath = path.join(__dirname, 'fixtures', 'plan.txt');
    const mdxPath = path.join(__dirname, 'fixtures', 'implement-plan.mdx');

    // Read plan.txt content
    const planContent = fs.readFileSync(planPath, 'utf-8');

    // Render the MDX with the plan injected as data
    const result = await renderMDXPromptFile({
      filePath: mdxPath,
      data: { plan: planContent },
    });

    // Expect angle brackets to be preserved, not escaped as HTML entities
    expect(result).toContain('<MyComponent>');
    expect(result).toContain('<div className="test">');
    expect(result).toContain('<b>bold text</b>');
    expect(result).toContain('<custom-elements>');
    expect(result).toContain('"property": "<value>"');

    // Verify we don't see escaped HTML entities
    expect(result).not.toContain('&lt;MyComponent&gt;');
    expect(result).not.toContain('&lt;div className="test"&gt;');
    expect(result).not.toContain('&lt;b&gt;bold text&lt;/b&gt;');
  });
});
