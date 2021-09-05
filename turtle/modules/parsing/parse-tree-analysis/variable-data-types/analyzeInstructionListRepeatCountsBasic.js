import { getInstructionListRepeatCountBasic } from './getInstructionListRepeatCountBasic.js';
import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function analyzeInstructionListRepeatCountsBasic(cachedParseTree, tokenValueMap) {
	const instructionLists = cachedParseTree.
		getTokensByTypes([ParseTreeTokenType.LIST, ParseTreeTokenType.TREE_ROOT]).
		filter(isInstructionList);
	const repeatCounts = new Map();

	// basic repeat count calculations.
	instructionLists.forEach(function(instructionList) {
		const result = getInstructionListRepeatCountBasic(instructionList, tokenValueMap);
		if (result !== undefined)
			repeatCounts.set(instructionList, result);
	});

	return {
		'instructionLists': instructionLists,
		'repeatCounts': repeatCounts
	};
};