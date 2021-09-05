import { DataTypes } from '../../../data-types/DataTypes.js';
import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { printChildren } from '../helpers/printChildren.js';

export function processAbsCall(token, result, cachedParseTree) {
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	let weblogoName = 'abs';
	if (parameterValueTokens.length === 1) {
		const types = cachedParseTree.getTokensToDataTypes().get(parameterValueTokens[0]);
		if (types !== undefined) {
			/*
			The abs command in WebLogo does not work with lists.
			The hypot command in WebLogo is good for lists, though.
			*/
			const tokenTypes = DataTypes.stringify(types);
			if (tokenTypes === 'list' || tokenTypes === 'tuple' || tokenTypes === 'list|tuple')
				weblogoName = 'hypot';
		}
	}
	result.append(`${weblogoName} `);
	printChildren(token, result, cachedParseTree);
};