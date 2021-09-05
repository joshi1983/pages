import { defFixer } from './defFixer.js';
import { lineFixer } from './lineFixer.js';

const fixers = [defFixer, lineFixer];

export function fixQBasicParseTree(root) {
	for (const fixer of fixers)
		fixer(root);
};