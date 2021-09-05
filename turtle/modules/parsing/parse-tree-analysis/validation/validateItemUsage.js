import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function getListValue(cachedParseTree, tokenValues, variables, listToken) {
	const val = tokenValues.get(listToken);
	if (val !== undefined && (val instanceof Array || typeof val === 'string'))
		return val;
}

function validateItemUsage_(cachedParseTree, parseLogger) {
	const variables = cachedParseTree.getVariables();
	const tokenValues = cachedParseTree.getTokenValues();
	const itemCalls = cachedParseTree.getCommandCallsByName('item').
		filter(token => token.children.length === 2 &&
			(
				token.children[1].isStringLiteral() ||
				token.children[1].type === ParseTreeTokenType.LIST ||
				(token.children[1].type === ParseTreeTokenType.VARIABLE_READ &&
				variables.hasVariable(token.children[1].val.toLowerCase()))
			) &&
			tokenValues.has(token.children[0]));
	itemCalls.forEach(function(itemCall) {
		const indexVal = tokenValues.get(itemCall.children[0]);
		if (indexVal < 1)
			parseLogger.error(`item index parameter must be at least 1.  You specified ${indexVal}`, itemCall.children[0]);
		else {
			const listVal = getListValue(cachedParseTree, tokenValues, variables, itemCall.children[1]);
			if (listVal !== undefined) {
				if (listVal.length === 0)
					parseLogger.error(`The ${typeof listVal === 'string' ? 'string' : 'list'} is empty so you can not read any elements from it`, itemCall.children[1]);
				else if (listVal.length < indexVal)
					parseLogger.error(`item index parameter must be in 1..${listVal.length} but you specified index ${indexVal}`, itemCall.children[0]);
			}
		}
	});
}

export function validateItemUsage(cachedParseTree, parseLogger) {
	validateItemUsage_(cachedParseTree, parseLogger);
};