import { Variable } from './Variable.js';

export function addVariableDeclarationWithName(token, variableName, result) {
	let variable = result.get(variableName);
	if (variable === undefined) {
		variable = new Variable(variableName);
		result.set(variableName, variable);
	}
	variable.addDeclaration(token);
};

export function addVariableDeclaration(identifierToken, result) {
	const variableName = identifierToken.val.toLowerCase();
	addVariableDeclarationWithName(identifierToken, variableName, result);
};