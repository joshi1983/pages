import { filterBrackets } from './helpers/filterBrackets.js';
import { isInstructionList } from
'../../../parse-tree-analysis/isInstructionList.js';
import { processInstructionList } from
'./processInstructionList.js';
import { processToken } from './processToken.js';

export function processList(token, result) {
	if (isInstructionList(token)) {
		processInstructionList(token, result);
		return;
	}
	const filteredChildren = filterBrackets(token.children);
	result.append('[');
	for (let i = 0; i < filteredChildren.length; i++) {
		if (i !== 0)
			result.append(', ');
		processToken(filteredChildren[i], result);
	}
	result.append(']');
};