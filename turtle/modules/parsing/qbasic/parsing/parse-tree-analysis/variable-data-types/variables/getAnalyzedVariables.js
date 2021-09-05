import { addVariablesFromArgLists } from './addVariablesFromArgLists.js';
import { addVariablesFromAssignments } from './addVariablesFromAssignments.js';
import { addVariablesFromDims } from './addVariablesFromDims.js';

export function getAnalyzedVariables(root) {
	const result = new Map();
	addVariablesFromArgLists(root, result);
	addVariablesFromAssignments(root, result);
	addVariablesFromDims(root, result);

	return result;
};