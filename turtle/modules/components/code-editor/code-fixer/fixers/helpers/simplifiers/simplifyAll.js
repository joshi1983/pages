import { jumpFixer } from
'../../jumpFixer.js';
import { removeEmptyIfStatements } from
'../removeEmptyIfStatements.js';
import { removeRedundantConsecutiveCommandCalls } from
'../removeRedundantConsecutiveCommandCalls.js';
import { removeUnneededCurvedBrackets } from
'../removeUnneededCurvedBrackets.js';
import { simplifyAbs } from
'./simplifyAbs.js';
import { simplifyCreatePList2 } from
'./simplifyCreatePList2.js';
import { simplifyForeverBreak } from
'./simplifyForeverBreak.js';
import { simplifyUnaryOperators } from
'./simplifyUnaryOperators.js';
import { simplifyWithArcLines } from
'./simplifyWithArcLines.js';
import { simplifyWithPolygon } from
'./simplifyWithPolygon.js';

const simplifiers = [
	jumpFixer,
	removeEmptyIfStatements,
	removeRedundantConsecutiveCommandCalls,
	removeUnneededCurvedBrackets,
	simplifyAbs,
	simplifyCreatePList2,
	simplifyForeverBreak,
	simplifyUnaryOperators,
	simplifyWithArcLines,
	simplifyWithPolygon
];

export function simplifyAll(cachedParseTree, fixLogger) {
	for (const simplifier of simplifiers) {
		simplifier(cachedParseTree, fixLogger);
	}
};