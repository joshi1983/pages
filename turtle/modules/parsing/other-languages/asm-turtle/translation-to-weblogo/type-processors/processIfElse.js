import { jumpNameToNotComparison } from './jumpNameToNotComparison.js';
import { processTokens } from './processTokens.js';

export function processIfElse(token, result, settings) {
	result.processCommentsUpToToken(token);
	result.trimRight();
	if (token.children.length === 2) {
		let jumpConditionEnding = jumpNameToNotComparison(token.jumpName);
		result.append(`\nifelse :${settings.comparisonRegisterName} ${jumpConditionEnding} [\n`);
		processTokens(token.children[0].children, result, settings);
		result.append('\n] [\n');
		processTokens(token.children[1].children, result, settings);
		result.append('\n]');
	}
	else {
		processTokens(token.children, result, settings);
	}
};