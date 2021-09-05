import { jumpNameToComparison } from './jumpNameToComparison.js';
import { processTokens } from './processTokens.js';

export function processDoWhile(token, result, settings) {
	result.processCommentsUpToToken(token);
	let jumpConditionEnding = jumpNameToComparison(token.jumpName);
	result.trimRight();
	result.append(`\ndo.while [\n`);
	processTokens(token.children, result, settings);
	result.append(`\n] :${settings.comparisonRegisterName} ${jumpConditionEnding}\n`);
};