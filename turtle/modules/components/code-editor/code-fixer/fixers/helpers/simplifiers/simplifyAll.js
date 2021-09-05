import { cancelDivisions } from
'./cancelDivisions.js';
import { jumpFixer } from
'../../jumpFixer.js';
import { removeEmptyIfStatements } from
'../removeEmptyIfStatements.js';
import { removeRedundantConsecutiveCommandCalls } from
'../removeRedundantConsecutiveCommandCalls.js';
import { removeUnneededCurvedBrackets } from
'../removeUnneededCurvedBrackets.js';
import { simplifyBinaryOperators } from
'./simplifyBinaryOperators.js';
import { simplyByUnwrappingTokens } from
'./simplyByUnwrappingTokens.js';
import { simplifyCreatePList2 } from
'./simplifyCreatePList2.js';
import { simplifyForeverBreak } from
'./simplifyForeverBreak.js';
import { simplifyParameterizedGroups } from
'./simplifyParameterizedGroups.js';
import { simplifySignSymmetricParameterizedGroups } from
'./simplifySignSymmetricParameterizedGroups.js';
import { simplifyUnaryOperators } from
'./simplifyUnaryOperators.js';
import { simplifyWithArcLines } from
'./simplifyWithArcLines.js';
import { simplifyWithPolygon } from
'./simplifyWithPolygon.js';
import { WrappedFixLogger } from
'../../../WrappedFixLogger.js';

const simplifiers = [
	cancelDivisions,
	jumpFixer,
	removeEmptyIfStatements,
	removeRedundantConsecutiveCommandCalls,
	removeUnneededCurvedBrackets,
	simplifyBinaryOperators,
	simplyByUnwrappingTokens,
	simplifyCreatePList2,
	simplifyForeverBreak,
	simplifyParameterizedGroups,
	simplifySignSymmetricParameterizedGroups,
	simplifyUnaryOperators,
	simplifyWithArcLines,
	simplifyWithPolygon
];

export function simplifyAll(cachedParseTree, fixLogger) {
	const wFixLogger = new WrappedFixLogger(fixLogger);
	const limit = 10;
	let i;
	wFixLogger._logCalled = true;
	for (i = 0; wFixLogger.hasLoggedAnything() && i < limit; i++) {
		wFixLogger._logCalled = false;
		for (const simplifier of simplifiers) {
			simplifier(cachedParseTree, wFixLogger);
		}
	}
	if (i === limit) {
		// It is very unlikely to meaningfully simplify the same code that many times.
		// Instead, one of the fixers could be logging messages without changing anything.
		// One of the fixers might also be changing things that then get reverted by another fixer.
		console.error(`simplifyAll reached limit of ${limit} indicating a probable bug in one of its fixers.`);
	}
};