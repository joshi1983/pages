import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from
'../processToken.js';

function isBackgroundApplicable(token, settings) {
	const children = token.children;
	if (children.length === 2) {
		const nameToken = children[0];
		if (nameToken.val !== 'background')
			return false;
		const args = filterBracketsAndCommas(children[1].children);
		if (args.length !== 1)
			return false;
		const tokenTypes = settings.cachedParseTree.getTokensToDataTypes();
		const dataTypes = tokenTypes.get(args[0]);
		return dataTypes === 'PImage';
	}
	return false;
};

export function background(token, result, settings) {
	const children = token.children;
	if (children.length === 2) {
		const args = filterBracketsAndCommas(children[1].children);
		if (args.length === 1) {
			result.append(`\nimage 100 100 `);
			processToken(args[0], result, settings);
		}
	}
};

background.isApplicable = isBackgroundApplicable;