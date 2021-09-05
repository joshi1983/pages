import { insertMissingMultiplyOperators } from
'./insertMissingMultiplyOperators.js';
import { joinPoundTokensWithIntegerLiterals } from
'./joinPoundTokensWithIntegerLiterals.js';
import { moveAsTypeInDim } from
'./moveAsTypeInDim.js';
import { scanTokensToCustomFunctionNames } from
'../../parsing/parse-tree-analysis/scanTokensToCustomFunctionNames.js';
import { splitCompleteNumberPrefix } from './splitCompleteNumberPrefix.js';
import { splitDefPrefix } from './splitDefPrefix.js';
import { splitDefTypePrefix } from './splitDefTypePrefix.js';
import { splitDimPrefix } from './splitDimPrefix.js';
import { splitForOutputAsPrefix } from './splitForOutputAsPrefix.js';
import { splitForPrefix } from './splitForPrefix.js';
import { splitGotoPrefix } from './splitGotoPrefix.js';
import { splitIfPrefix } from './splitIfPrefix.js';
import { splitNextPrefix } from './splitNextPrefix.js';
import { splitStatementPrefix } from './splitStatementPrefix.js';
import { splitStepPrefix } from './splitStepPrefix.js';
import { splitTypePrefix } from './splitTypePrefix.js';
import { splitWendPrefix } from './splitWendPrefix.js';
import { splitWhilePrefix } from './splitWhilePrefix.js';

const sanitizers = [
	insertMissingMultiplyOperators,
	joinPoundTokensWithIntegerLiterals,
	moveAsTypeInDim,
	splitCompleteNumberPrefix,
	splitDefPrefix,
	splitDefTypePrefix,
	splitDimPrefix,
	splitForOutputAsPrefix,
	splitForPrefix,
	splitGotoPrefix,
	splitIfPrefix,
	splitNextPrefix,
	splitStatementPrefix,
	splitStepPrefix,
	splitTypePrefix,
	splitWendPrefix,
	splitWhilePrefix
];

export function runAllSanitizers(scanTokens) {
	let customFunctionNames = scanTokensToCustomFunctionNames(scanTokens);
	const oldLen = scanTokens.length;
	splitDefPrefix(scanTokens, customFunctionNames);
	if (oldLen !== scanTokens.length) {
		// The def prefix split may change the calculated custom function names.
		customFunctionNames = scanTokensToCustomFunctionNames(scanTokens);
	}
	let continueLooping = true;
	// The loop is limited to just a few iterations to mitigate the risk of an infinite loop.
	// An infinite loop shouldn't happen if the sanitizers are bug-free but mistakes and bugs happen.
	for (let i = 0; continueLooping && i < 3; i++) {
		for (const sanitizer of sanitizers) {
			const lenBefore = scanTokens.length;
			sanitizer(scanTokens, customFunctionNames);
			if (scanTokens.length !== lenBefore)
				continueLooping = true;
		}
	}
};