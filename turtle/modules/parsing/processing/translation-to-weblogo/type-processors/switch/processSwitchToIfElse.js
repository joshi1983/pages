import { assignVariableIfNeeded } from './assignVariableIfNeeded.js';
import { doNotTranslateBreaks } from './doNotTranslateBreaks.js';
import { isNonemptyCase } from './isNonemptyCase.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processSwitchDefaultsOnly } from './processSwitchDefaultsOnly.js';
import { processSwitchValue } from './processSwitchValue.js';
import { processToken } from '../processToken.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function processSwitchToIfElse(token, result, settings) {
	const codeBlock = switchToCodeBlock(token);
	const defaults = codeBlock.children.filter(t => t.type === ParseTreeTokenType.DEFAULT);
	const hasDefault = defaults.length !== 0;
	const cases = codeBlock.children.filter(t => t.type === ParseTreeTokenType.CASE);
	const varName = assignVariableIfNeeded(token, result, settings);
	let prevIndex = -1;
	let nestingLevel = 0;
	for (let i = 0; i < cases.length; i++) {
		const case1 = cases[i];
		if (isNonemptyCase(case1)) {
			let commandName = 'if';
			if (hasDefault || i < cases.length - 1)
				commandName = 'ifelse';

			result.append(commandName);
			const useOr = prevIndex < i - 1;
			if (useOr) {
				result.append(' ( or ');
			}
			for (let j = prevIndex + 1; j <= i; j++) {
				const caseJ = cases[j];
				const caseValue = caseJ.children[0];
				if (caseValue !== undefined && caseValue.type !== ParseTreeTokenType.COLON) {
					if (varName !== undefined)
						result.append(' ' + varName + ' ');
					else
						processSwitchValue(token, result, settings);

					result.append(' = ');
					processToken(caseValue, result, settings);
				}
			}
			if (useOr)
				result.append(' ) ');

			const case1CodeBlock = case1.children[case1.children.length - 1];
			if (case1CodeBlock !== undefined && case1CodeBlock.type === ParseTreeTokenType.CODE_BLOCK) {
				doNotTranslateBreaks(case1CodeBlock, settings);
				processToken(case1CodeBlock, result, settings);
				if (case1CodeBlock.children.some(t => t.type === ParseTreeTokenType.BREAK))
					prevIndex = i;
			}
			else {
				result.append('\n[]\n');
			}
			
			if (commandName === 'ifelse') {
				result.append(' [\n');
				nestingLevel++;
			}
			else {
				result.append('\n]\n');
			}
		}
	}
	processSwitchDefaultsOnly(token, result, settings);

	for (let j = 1; j < nestingLevel; j++) {
		result.append('\n]\n');
	}
};