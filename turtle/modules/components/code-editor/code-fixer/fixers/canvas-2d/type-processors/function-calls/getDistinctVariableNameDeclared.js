import { getDistinctVariableName } from
'../../../../../../../parsing/generic-parsing-utilities/getDistinctVariableName.js';
import { isInFunctionBody } from
'../../../../../../../parsing/js-parsing/parsing/parse-tree-analysis/isInFunctionBody.js';

export function getDistinctVariableNameDeclared(token, result, prefix, settings) {
	if (isInFunctionBody(token))
		result.append('local');
	const resultName = getDistinctVariableName(prefix, settings.identifiersSet);
	result.append(`make "${resultName} `);
	settings.identifiersSet.add(resultName);
	return resultName;
};