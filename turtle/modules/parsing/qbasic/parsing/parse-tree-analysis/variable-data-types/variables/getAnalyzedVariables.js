import { addVariablesFromArgLists } from './addVariablesFromArgLists.js';
import { addVariablesFromAssignments } from './addVariablesFromAssignments.js';
import { addVariablesFromDims } from './addVariablesFromDims.js';
import { addVariablesFromForLoops } from './addVariablesFromForLoops.js';

export function getAnalyzedVariables(root) {
	const result = new Map();
	addVariablesFromArgLists(root, result);
	addVariablesFromAssignments(root, result);
	addVariablesFromDims(root, result);
	addVariablesFromForLoops(root, result);

	return result;
};