# Partial Emphases Extension

This is a small extension for the Lezer Markdown parser that handles emphasis markers differently than the standard implementation. It lets you style text as you type by extending unclosed markers to the end of the current block.

## What It Does

Normally, if you type `*hello` without a closing `*`, Markdown treats it as plain text. This extension changes that so it becomes emphasis that automatically closes at the end of the line:

| Input | Standard Parser | With This Extension |
|-------|----------------|---------------------|
| `*hello*` | Emphasis | Emphasis |
| `*hello` | Plain text | Emphasis (auto-closes) |
| `**hello` | Plain text | Strong emphasis (auto-closes) |
| `*a **b** c*` | Nested emphasis | Nested emphasis |
| `*italic **bold* text**` | Complex overlap | Split at overlap |

## Why I Built This

I wanted to create a rich Markdown editing experience where formatting appears as you type, without needing to close markers immediately. The standard Lezer parser is strict about CommonMark compliance, which makes sense for final rendering but feels clunky during editing.

## Why I Had to Modify Lezer-Markdown

Here's the important part: this extension couldn't be built using Lezer's normal extension hooks. The parser's delimiter resolution is designed around a strict tree structure that doesn't allow for:
- Unmatched opening markers that extend to block end
- Overlapping emphasis ranges
- Custom resolution logic

To make this work, I added a new hook called `delimiterResolvers` to the Lezer Markdown parser itself. This lets extensions run custom delimiter resolution *before* the standard CommonMark algorithm kicks in. The modified parser lives in [lezer-markdown-delimiterResolvers](https://github.com/bxff/lezer-markdown-delimiterResolvers ).

## How It Works

The code does three main things:

**First**, it scans for `*` and `_` characters and marks them as potential delimiters. For each one, it checks if it can open or close emphasis based on CommonMark rules.

**Second**, it matches opening and closing delimiters. When it finds a closer, it looks backwards for a matching opener. If sizes differ (like `*` vs `**`), it prefers an exact match when possible. Any openers that never find a match get extended to the block end.

**Third**, it builds the final tree structure. Overlapping ranges get split at their intersection points so everything nests correctly.

## Why Overlapping Emphasis Is Hard

Take this example: `*italics and **italics-bold* bold only**`

The two emphasis ranges overlap:
- `*...*` from position 0-28
- `**...**` from position 13-40

You can't represent this as a clean tree without splitting. My approach collects all matches first, then detects overlaps and splits them before building the final tree. This is why I needed the delimiter resolution hook.

## Performance

The implementation follows the same algorithmic complexity as the standard `@lezer/markdown` parser:

- Scanning text: O(n) single pass
- Matching delimiters: O(n²) worst case (backward scan per closer, identical to standard)
- Building tree: O(n log n) for sorting plus linear traversal

Each phase uses similar data structures and operations as the original `resolveMarkers` implementation, so performance characteristics should be comparable.

## Installation

```typescript
import { markdown } from "@codemirror/lang-markdown"
import { PartialEmphasis } from "./extension/partial-emphases"

// Use with CodeMirror
const extensions = [markdown({ extensions: [PartialEmphasis] })]
```

## Running the Demo

```bash
# Build the modified parser and run demo
cd lezer-markdown-delimiterResolvers && bun install && bun run prepare
cd ../demo && bun install && bun run dev
```