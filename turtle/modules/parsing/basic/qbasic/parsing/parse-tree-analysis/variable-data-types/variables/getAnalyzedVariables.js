import { addVariablesFromArgLists } from './addVariablesFromArgLists.js';
import { addVariablesFromAssignments } from './addVariablesFromAssignments.js';
import { addVariablesFromDefPrimitives } from './addVariablesFromDefPrimitives.js';
import { addVariablesFromDims } from './addVariablesFromDims.js';
import { addVariablesFromForLoops } from './addVariablesFromForLoops.js';
import { addVariablesFromFunctionCallAssignments } from './addVariablesFromFunctionCallAssignments.js';

export function getAnalyzedVariables(root) {
	const result = new Map();
	addVariablesFromArgLists(root, result);
	addVariablesFromAssignments(root, result);
	addVariablesFromDefPrimitives(root, result);
	addVariablesFromDims(root, result);
	addVariablesFromForLoops(root, result);
	addVariablesFromFunctionCallAssignments(root, result);

	return result;
};