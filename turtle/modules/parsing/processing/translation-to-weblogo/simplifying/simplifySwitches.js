import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isNonemptyCase } from '../type-processors/switch/isNonemptyCase.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { switchToCodeBlock } from '../type-processors/switch/switchToCodeBlock.js';
import { wrapInCurvedBrackets } from './wrapInCurvedBrackets.js';

function removeEmptyCasesImmediatelyPrecedingDefault(switchToken) {
	const mainCodeBlock = switchToCodeBlock(switchToken);
	if (mainCodeBlock !== null) {
		const defaults = mainCodeBlock.children.filter(t => t.type === ParseTreeTokenType.DEFAULT);
		// There should be at most 1 default per switch but let's not depend on that assumption.
		for (const defaultClaus of defaults) {
			let prev = defaultClaus.getPreviousSibling();
			while (prev !== null && prev.type === ParseTreeTokenType.CASE && !isNonemptyCase(prev)) {
				const prevPrev = prev.getPreviousSibling();
				prev.remove();
				prev = prevPrev;
			}
		}
	}
}

function removeEmptyDefaults(switchToken) {
	const mainCodeBlock = switchToCodeBlock(switchToken);
	if (mainCodeBlock !== null) {
		const defaults = mainCodeBlock.children.filter(t => t.type === ParseTreeTokenType.DEFAULT);
		for (const defaultClaus of defaults) {
			const codeBlock = defaultClaus.children.filter(t => t.type === ParseTreeTokenType.CODE_BLOCK)[0];
			if (codeBlock === undefined || codeBlock.children.length === 0)
				defaultClaus.remove();
		}
	}
}

function removeTrailingEmptyCases(switchToken) {
	const mainCodeBlock = switchToCodeBlock(switchToken);
	if (mainCodeBlock !== null) {
		const cases = mainCodeBlock.children.filter(t => t.type === ParseTreeTokenType.CASE);
		for (let i = cases.length - 1; i >= 0; i--) {
			const case1 = cases[i];
			const next = case1.getNextSibling();
			if (!isNonemptyCase(case1) && (next === null || next.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET)) {
				case1.remove();
			}
		}
	}
}

function removeIfEmpty(switchToken) {
	const mainCodeBlock = switchToCodeBlock(switchToken);
	if (mainCodeBlock === null) {
		switchToken.remove();
		return;
	}
	const blockChildren = mainCodeBlock.children.filter(t => 
	t.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
	t.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET);
	if (blockChildren.length === 0) {
		switchToken.remove();
	}
}

function wrapSwitchValueInCurvedBrackets(switchToken) {
	const switchValue = switchToken.children[0];
	if (switchValue !== undefined)
		wrapInCurvedBrackets(switchValue);
}

export function simplifySwitches(root) {
	const switches = getDescendentsOfType(root, ParseTreeTokenType.SWITCH);
	for (const switchToken of switches) {
		wrapSwitchValueInCurvedBrackets(switchToken);
		removeEmptyCasesImmediatelyPrecedingDefault(switchToken);
		removeEmptyDefaults(switchToken);
		removeTrailingEmptyCases(switchToken);
		removeIfEmpty(switchToken);
	}
};