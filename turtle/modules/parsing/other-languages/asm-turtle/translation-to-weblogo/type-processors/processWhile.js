import { jumpNameToNotComparison } from './jumpNameToNotComparison.js';
import { processTokens } from './processTokens.js';

export function processWhile(token, result, settings) {
	result.processCommentsUpToToken(token);
	let jumpConditionEnding = jumpNameToNotComparison(token.jumpName);
	result.trimRight();
	result.append(`\nwhile :${settings.comparisonRegisterName} ${jumpConditionEnding} [\n`);
	processTokens(token.children, result, settings);
	result.append('\n]\n');
};