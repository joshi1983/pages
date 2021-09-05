import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDistinctVariableName } from
'./getDistinctVariableName.js';
import { mightBeDataValue } from
'../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { processToken } from
'./type-processors/processToken.js';

function isDataCall(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;
	const firstChild = children[0];
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER &&
	firstChild.val.toLowerCase() === 'data') {
		return true;
	}
	return false;
}

function processConstants(dataCall, result, options) {
	const argList = dataCall.children[1];
	for (const child of argList.children.filter(mightBeDataValue)) {
		processToken(child, result, options);
		result.append(' ');
	}
	result.append('\n');
}

function addReadProc(result, options) {
	const procName = getDistinctVariableName('readValue', options);
	result.append(`
to ${procName}
	localmake "val item :${options.dataIndexVarName} :${options.dataVarName}
	make "${options.dataIndexVarName} 1 + :${options.dataIndexVarName}
	output :val
end
`);
	return procName;
}

function addRestoreProc(result, options) {
	const procName = getDistinctVariableName('restoreReadPosition', options);
	result.append(`
to ${procName}
	make "${options.dataIndexVarName} 1
end
`);
	return procName;
}

export function translateDataSections(root, result, options) {
	const dataCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isDataCall);
	if (dataCalls.length === 0)
		return;

	const dataVarName = getDistinctVariableName('dataList', options);
	const dataIndexVarName = getDistinctVariableName('dataIndex', options);
	options.dataVarName = dataVarName;
	options.dataIndexVarName = dataIndexVarName;
	options.readProcName = addReadProc(result, options);
	options.restoreProcName = addRestoreProc(result, options);

	result.append(`\nmake "${dataIndexVarName} 1\n`);
	result.append(`\nmake "${dataVarName} [\n`);
	for (const dataCall of dataCalls) {
		processConstants(dataCall, result, options);
	}
	result.append('\n]\n');
};