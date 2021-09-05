import { CachedParseTree } from '../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';

export function findToken(filterInfo, tokens, logger) {
	if (typeof filterInfo !== 'object')
		throw new Error('filterInfo must be an object');
	if (tokens instanceof CachedParseTree)
		tokens = tokens.getAllTokens();
	if (typeof logger !== 'function')
		throw new Error('logger must be a function');

	const matches = tokens.filter(function(token) {
		if (filterInfo.val !== undefined && filterInfo.val !== token.val)
			return false;
		if (filterInfo.type !== undefined && filterInfo.type !== token.type)
			return false;
		if (filterInfo.hasParentVal !== undefined && (token.parentNode === null || token.parentNode.val !== filterInfo.hasParentVal))
			return false;
		if (filterInfo.hasParentType !== undefined && (token.parentNode === null || token.parentNode.type !== filterInfo.hasParentType))
			return false;
		if (filterInfo.hasGrandParentVal !== undefined && (token.parentNode === null || token.parentNode.parentNode === null || token.parentNode.parentNode.val !== filterInfo.hasGrandParentVal))
			return false;
		if (filterInfo.hasChildVal !== undefined) {
			if (!token.children.some(function(childToken) {
				return childToken.val === filterInfo.hasChildVal;
			}))
				return false;
		}
		return true;
	});
	if (matches.length !== 1) {
		const type = filterInfo.type;
		delete filterInfo.type;
		let filterDescription = JSON.stringify(filterInfo);
		if (type !== undefined)
			filterDescription += `, type=${ParseTreeTokenType.getNameFor(type)}`;
		logger(`Expected 1 matched token but found ${matches.length}.  filterInfo = ${filterDescription}`);
	}
	else
		return matches[0];
};