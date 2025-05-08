# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build Commands
- `pnpm build` - Build the project (TypeScript compilation + Rollup bundling)
- `pnpm build:watch` - Watch mode for development
- `pnpm test` - Run Jest tests
- `pnpm format` - Format code with Prettier
- `pnpm lint` - Check code formatting with Prettier

### Publishing Commands
- `pnpm ci:version` - Run changeset version update
- `pnpm ci:publish` - Build and publish the package using changeset
- `pnpm check-exports` - Verify package export configurations

## Architecture

mdx-prompt is a lightweight library for writing LLM prompts as JSX/MDX components. The core features include:

1. **MDX/JSX to String Conversion**: Transform React/MDX components into formatted strings suitable for LLM APIs
2. **Component Library**: Pre-built components for common prompt patterns
3. **Multiple Usage Patterns**: Support for both inline JSX and MDX file-based workflows

### Key Concepts

- **Prompt Components**: JSX components like `<Purpose>`, `<Instructions>`, etc. that render as custom XML-like tags
- **Rendering Pipeline**: MDX/JSX → React elements → Static HTML/XML → Formatted prompt string
- **Data Injection**: Pass data into prompts via React props or MDX scope variables

### Core Files

- `src/render.ts` - Main rendering functions (`renderMDX` and `renderMDXPromptFile`)
- `src/utils.ts` - Utility functions for formatting prompt output
- `src/components/prompt.tsx` - Core prompt structure components (`<Prompt>`, `<Purpose>`, etc.)
- `src/components/html.tsx` - HTML element overrides for rendering

### Key Functions

1. `renderMDX`: Takes a React element and returns a formatted prompt string
2. `renderMDXPromptFile`: Reads an MDX file, compiles it with next-mdx-remote, injects data, and returns the formatted string
3. `prettyPrompt`: Uses rehype to format prompt output for better readability

### Import/Export Structure

The package exports several module entry points:
- Main module: Full library exports
- Components: Prompt structure components
- HTML components: DOM element overrides
- Render functions: For converting MDX to strings

## Development Tips

1. When creating new components:
   - Follow the pattern in `src/components/prompt.tsx`
   - Add proper JSDoc comments for documentation
   - Export via `src/components/index.tsx`

2. The package uses Rollup for bundling with:
   - ESM and CJS output formats
   - Proper handling of peer dependencies (React)
   - TypeScript compilation via plugin

3. TypeScript types are generated during build and go to `dist/types`

4. When adding tests, use Jest - the package has Jest set up but tests may need to be added