import { circleCoordsRadiusColorFixer } from './circleCoordsRadiusColorFixer.js';
import { defFixer } from './defFixer.js';
import { defFunctionGlobalFixer } from './defFunctionGlobalFixer.js';
import { lineFixer } from './lineFixer.js';

const fixers = [
circleCoordsRadiusColorFixer,defFixer, defFunctionGlobalFixer, lineFixer];

export function fixQBasicParseTree(root) {
	let continueFixing = true;
	while (continueFixing) {
		continueFixing = false;
		for (const fixer of fixers) {
			const result = fixer(root);
			continueFixing = continueFixing || result;
		}
	}
};