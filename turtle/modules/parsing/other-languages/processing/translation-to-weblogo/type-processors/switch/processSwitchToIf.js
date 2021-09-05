import { assignVariableIfNeeded } from './assignVariableIfNeeded.js';
import { doNotTranslateBreaks } from './doNotTranslateBreaks.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processCodeBlock } from '../processCodeBlock.js';
import { processToken } from '../processToken.js';
import { processSwitchValue } from './processSwitchValue.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function processSwitchToIf(switchToken, result, settings) {
	const codeBlock = switchToCodeBlock(switchToken);
	const cases = codeBlock.children.filter(t => t.type === ParseTreeTokenType.CASE);
	const case1 = cases[cases.length - 1];
	const caseCodeBlock = case1.children[case1.children.length - 1];
	const varName = assignVariableIfNeeded(switchToken, result, settings);
	result.append('if ');

	if (cases.length !== 1) {
		if (cases.length > 2)
			result.append(' ( ');
		result.append('or ');
	}
	for (const case_ of cases) {
		const caseValueToken = case_.children[0];
		if (varName === undefined)
			processSwitchValue(switchToken, result, settings);
		else
			result.append(`:${varName}`);

		result.append(' = ');
		processToken(caseValueToken, result,  settings);
		result.append(' ');
	}
	if (cases.length > 2)
		result.append(' ) ');

	result.append(' [\n');
	
	doNotTranslateBreaks(caseCodeBlock, settings);
	processCodeBlock(caseCodeBlock, result, settings, false);
	result.append('\n]\n');
};