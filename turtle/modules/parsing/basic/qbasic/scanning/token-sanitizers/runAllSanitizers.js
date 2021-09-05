import { insertMissingMultiplyOperators } from
'./insertMissingMultiplyOperators.js';
import { scanTokensToCustomFunctionNames } from
'../../parsing/parse-tree-analysis/scanTokensToCustomFunctionNames.js';
import { splitDefPrefix } from './splitDefPrefix.js';
import { splitDefTypePrefix } from './splitDefTypePrefix.js';
import { splitDimPrefix } from './splitDimPrefix.js';
import { splitForPrefix } from './splitForPrefix.js';
import { splitGotoPrefix } from './splitGotoPrefix.js';
import { splitIfPrefix } from './splitIfPrefix.js';
import { splitNextPrefix } from './splitNextPrefix.js';
import { splitPokePrefix } from './splitPokePrefix.js';
import { splitScreenPrefix } from './splitScreenPrefix.js';
import { splitTypePrefix } from './splitTypePrefix.js';
import { splitWendPrefix } from './splitWendPrefix.js';
import { splitWhilePrefix } from './splitWhilePrefix.js';

const sanitizers = [
	insertMissingMultiplyOperators,
	splitDefPrefix,
	splitDefTypePrefix,
	splitDimPrefix,
	splitForPrefix,
	splitGotoPrefix,
	splitIfPrefix,
	splitNextPrefix,
	splitPokePrefix,
	splitScreenPrefix,
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
	for (const sanitizer of sanitizers)
		sanitizer(scanTokens, customFunctionNames);
};