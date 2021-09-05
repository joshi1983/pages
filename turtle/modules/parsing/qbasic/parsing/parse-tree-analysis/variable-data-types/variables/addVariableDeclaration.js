import { Variable } from './Variable.js';

export function addVariableDeclaration(identifierToken, result) {
	const variableName = identifierToken.val.toLowerCase();
	let variable = result.get(variableName);
	if (variable === undefined) {
		variable = new Variable(variableName);
		result.set(variableName, variable);
	}
	variable.addDeclaration(identifierToken);
};