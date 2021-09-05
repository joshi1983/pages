import { jumpNameToNotComparison } from './jumpNameToNotComparison.js';
import { processTokens } from './processTokens.js';

export function processIf(token, result, settings) {
	result.processCommentsUpToToken(token);
	let jumpConditionEnding = jumpNameToNotComparison(token.jumpName);
	result.trimRight();
	result.append(`\nif :${settings.comparisonRegisterName} ${jumpConditionEnding} [\n`);
	processTokens(token.children, result, settings);
	result.append('\n]\n');
};