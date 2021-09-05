import { doesInstructionListOutputDirectly } from './doesInstructionListOutputDirectly.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isInProcedure } from '../isInProcedure.js';
import { isInstructionList } from '../isInstructionList.js';
import { isOutputOrStopToken } from '../isOutputOrStopToken.js';
import { OutputFrequency } from './OutputFrequency.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function evaluateOutputFrequencyBasic(cachedParseTree, result) {
	let instructionLists = cachedParseTree.getTokensByTypes([ParseTreeTokenType.LIST, ParseTreeTokenType.TREE_ROOT]).filter(isInstructionList);

	// set result for some basic cases.
	instructionLists = instructionLists.filter(function(instructionList) {
		if (!isInProcedure(instructionList))
			result.set(instructionList, OutputFrequency.Never);
		else if (doesInstructionListOutputDirectly(instructionList))
			result.set(instructionList, OutputFrequency.Always);
		else if (!getAllDescendentsAsArray(instructionList).some(isOutputOrStopToken))
			result.set(instructionList, OutputFrequency.Never);
		else
			return true;
		return false;
	});
	return instructionLists;
};