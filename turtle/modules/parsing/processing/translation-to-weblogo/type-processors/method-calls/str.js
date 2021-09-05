import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from
'../processToken.js';

function isApplicable(token, settings) {
	const children = token.children;
	if (children.length === 2) {
		const args = filterBracketsAndCommas(children[1].children);
		if (args.length === 1) {
			const dataTypes = settings.cachedParseTree.getTokensToDataTypes().get(args[0]);
			if (dataTypes === 'char' || dataTypes === 'String')
				return true;
		}
	}
	return false;
}

export function str(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but got ${settings}`);
	const children = token.children;
	if (children.length === 2) {
		const args = filterBracketsAndCommas(children[1].children);
		for (const arg of args) {
			processToken(arg, result, settings);
		}
	}
};

str.isApplicable = isApplicable;