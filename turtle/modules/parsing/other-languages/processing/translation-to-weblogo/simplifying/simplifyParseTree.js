import { simplifyBreaks } from './simplifyBreaks.js';
import { simplifyConditions } from './simplifyConditions.js';
import { simplifyForLoops } from './simplifyForLoops.js';
import { simplifyReturns } from './simplifyReturns.js';
import { simplifySwitches } from './simplifySwitches.js';

const simplifiers = [
	simplifyBreaks,
	simplifyConditions,
	simplifyForLoops,
	simplifyReturns,
	simplifySwitches
];

export function simplifyParseTree(root) {
	for (const simplifier of simplifiers) {
		simplifier(root);
	}
};