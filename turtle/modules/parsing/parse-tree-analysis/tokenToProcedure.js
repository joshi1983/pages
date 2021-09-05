import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { Procedure } from '../Procedure.js';

export function getParametersFromStartToken(startToken) {
	return startToken.children[1].children.filter(function(token) {
		return token.type === ParseTreeTokenType.VARIABLE_READ;
	}).map(function(parameterToken) {
		return parameterToken.val.toLowerCase();
	});
};

export function tokenToProcedure(startToken) {
	if (startToken.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		throw new Error('PROCEDURE_START_KEYWORD required but got token of type ' + ParseTreeTokenType.getNameFor(startToken.type));
	if (startToken.children.length < 2)
		throw new Error('startToken must have at least 2 children but only ' + startToken.children.length + ' found');

	const nameToken = startToken.children[0];
	const name = typeof nameToken.val === 'string' ? nameToken.val.toLowerCase() : '' + nameToken.val;
	const parameters = getParametersFromStartToken(startToken);
	return new Procedure(name, parameters, startToken.children[0]);
};