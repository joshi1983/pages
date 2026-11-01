import { DataTypes } from '../../../data-types/DataTypes.js';
await DataTypes.asyncInit();

export function getAssignedTypesForProcedureParameterBasic(cachedParseTree, procedure, parameterIndex, tokenTypesMap) {
	const calls = cachedParseTree.getProcedureCallsByName(procedure.name);
	if (calls.length === 0)
		return new DataTypes('*');

	// union all the types from callers.
	const result = new DataTypes();
	for (const call of calls) {
		const paramToken = call.children[parameterIndex];
		const types = tokenTypesMap.get(paramToken);
		if (types === undefined)
			return new DataTypes('*');
		result.addTypes(types);
	}
	return result;
};