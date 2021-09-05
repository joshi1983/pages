import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../../../parse-tree-analysis/getProceduresMap.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function containsNoArgProc(procsMap, procName) {
	const proc = procsMap.get(procName.toLowerCase());
	return proc !== undefined && proc.parameters.length === 0;
}

/*
tree should be a ParseTreeToken for a WebLogo parse tree
*/
export function getProcCallsCodeSnippetFor(tree) {
	const procs = ['setup', 'draw'];
	let result = '';
	const procsMap = getProceduresMap(tree);
	const calledProcs = new Set(getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP).map(t => t.val.toLowerCase()));
	for (const procName of procs) {
		if (containsNoArgProc(procsMap, procName) && !calledProcs.has(procName))
			result += procName + '\n';
	}
	return result.trim();
};