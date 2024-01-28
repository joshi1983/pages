import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { Procedure } from '../Procedure.js';

export function tokenToProcedure(startToken) {
	if (startToken.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		throw new Error('PROCEDURE_START_KEYWORD required but got token of type ' + ParseTreeTokenType.getNameFor(startToken.type));
	if (startToken.children.length < 2)
		throw new Error('startToken must have at least 2 children but only ' + startToken.children.length + ' found');

	const name = startToken.children[0].val.toLowerCase();
	const parameters = startToken.children[1].children.filter(function(token) {
		return token.type === ParseTreeTokenType.VARIABLE_READ;
	}).map(function(parameterToken) {
		return parameterToken.val.toLowerCase();
	});
	return new Procedure(name, parameters, startToken.children[0]);
};