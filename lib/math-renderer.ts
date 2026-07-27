import katex from 'katex';

export interface MathRenderOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  output?: 'html' | 'mathml' | 'htmlAndMathml';
}

/**
 * Formats and renders a raw LaTeX formula string into HTML using KaTeX.
 */
export function formatLaTeX(
  latex: string,
  displayMode = false,
  options?: MathRenderOptions
): string {
  try {
    const cleanLatex = latex.trim();
    return katex.renderToString(cleanLatex, {
      displayMode,
      throwOnError: false,
      ...options,
    });
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return `<span class="katex-error text-red-500 font-mono text-xs">${latex}</span>`;
  }
}

/**
 * Wraps an raw expression in inline ($...$) or display block ($$...$$) syntax.
 */
export function wrapMathExpression(expr: string, displayMode = false): string {
  const trimmed = expr.trim();
  if (displayMode) {
    return `$$\n${trimmed}\n$$`;
  }
  return `$${trimmed}$`;
}

/**
 * Scans input text and replaces inline ($...$) and block ($$...$$) math expressions with KaTeX HTML.
 */
export function renderMathInText(text: string): string {
  if (!text) return '';

  // 1. Process display math block ($$...$$)
  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, equation) => {
    return `<div class="katex-display-block my-4 overflow-x-auto flex justify-center py-2">${formatLaTeX(equation, true)}</div>`;
  });

  // 2. Process inline math ($...$)
  result = result.replace(/\$([^$\n]+?)\$/g, (_, equation) => {
    return `<span class="katex-inline">${formatLaTeX(equation, false)}</span>`;
  });

  return result;
}
