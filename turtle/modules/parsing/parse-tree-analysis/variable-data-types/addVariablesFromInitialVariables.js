import { DataTypes } from '../../data-types/DataTypes.js';
import { Variable } from './Variable.js';
import { VariableScope } from './VariableScope.js';

export function addVariablesFromInitialVariables(cachedParseTree, result) {
	const allAssignableTypes = DataTypes.getAllAssignableDataTypes();
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap()
	};
	for (const [name, singleValue] of cachedParseTree.initialVariablesMap) {
		if (!(result.hasVariable(name))) {
			const variable = new Variable(name);
			const assignToken = cachedParseTree.root;
			const fromToken = assignToken;
			const toToken = cachedParseTree.getLastToken();
			const assignedTypes = new DataTypes(DataTypes.getTypesCompatibleWithValue(singleValue, extraInfo));
			const requiredTypes = new DataTypes(allAssignableTypes);
			const scope = new VariableScope(assignToken, fromToken, toToken, 
				assignedTypes, requiredTypes, undefined, false, singleValue);
			variable.addScope(scope);
			result.addVariable(variable);
		}
	}
};