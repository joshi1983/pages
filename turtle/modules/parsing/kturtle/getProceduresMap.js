import { getDescendentsOfType } from '../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { Procedure } from './Procedure.js';

export function getProceduresMap(treeRoot) {
	const result = new Map();
	const learnTokens = getDescendentsOfType(treeRoot, ParseTreeTokenType.LEARN);
	learnTokens.forEach(function(learnToken) {
		const parent = learnToken.parentNode;
		const learnIndex = parent.children.indexOf(learnToken);
		let nameToken = parent.children[learnIndex + 1];
		let parametersStartIndex = learnIndex + 2;
		let parametersParent = parent;
		if (learnToken.children.length > 0) {
			nameToken = learnToken.children[0];
			parametersParent = learnToken.children[1];
			parametersStartIndex = 0;
		}
		if (nameToken === undefined || nameToken.type !== ParseTreeTokenType.IDENTIFIER)
			return;
		const parameters = [];
		for (let i = 0; true; i++) {
			const paramToken = parametersParent.children[parametersStartIndex + i];
			if (paramToken === undefined || (paramToken.type !== ParseTreeTokenType.VARIABLE_REFERENCE &&
			paramToken.type !== ParseTreeTokenType.COMMA)) {
				break;
			}
			if (paramToken.type === ParseTreeTokenType.VARIABLE_REFERENCE)
				parameters.push(paramToken.val);
		}
		const proc = new Procedure(nameToken.val, parameters, nameToken);
		result.set(proc.name, proc);
	});

	return result;
};