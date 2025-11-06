// Utility to parse and visualize different input types

export type VisualizationType = 'array' | 'tree' | 'linkedlist' | 'graph' | 'matrix' | 'string' | 'number' | 'json' | 'unknown';

export interface ParsedTestCase {
  input: string;
  parsedInput: any;
  visualizationType: VisualizationType;
  expectedOutput: string;
  parsedOutput: any;
  category: string;
}

// Try to parse JSON string safely
function tryParseJSON(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// Detect the type of input
function detectType(parsed: any): VisualizationType {
  if (Array.isArray(parsed)) {
    // Check if it's a matrix (array of arrays)
    if (parsed.length > 0 && Array.isArray(parsed[0])) {
      return 'matrix';
    }
    // Check if it looks like a linked list (object with val/next)
    if (parsed.length > 0 && typeof parsed[0] === 'object' && 'val' in parsed[0] && 'next' in parsed[0]) {
      return 'linkedlist';
    }
    // Check if it's a tree (object with val/left/right)
    if (parsed.length === 1 && typeof parsed[0] === 'object' && 'val' in parsed[0] && ('left' in parsed[0] || 'right' in parsed[0])) {
      return 'tree';
    }
    // Regular array
    return 'array';
  }
  if (typeof parsed === 'string') return 'string';
  if (typeof parsed === 'number') return 'number';
  if (typeof parsed === 'object') return 'graph';
  return 'json';
}

export function parseTestCase(testCase: any): ParsedTestCase {
  const input = testCase.input || '';
  const expectedOutput = testCase.expected_output || '';
  const category = testCase.category || '';

  const parsedInput = tryParseJSON(input);
  const parsedOutput = tryParseJSON(expectedOutput);
  const visualizationType = detectType(parsedInput);

  return {
    input,
    parsedInput,
    visualizationType,
    expectedOutput,
    parsedOutput,
    category,
  };
}

