import { lineFixer } from './lineFixer.js';

const fixers = [lineFixer];

export function fixQBasicParseTree(root) {
	for (const fixer of fixers)
		fixer(root);
};