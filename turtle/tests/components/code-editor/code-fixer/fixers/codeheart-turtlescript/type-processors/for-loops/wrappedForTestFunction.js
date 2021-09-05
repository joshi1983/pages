import { getDescendentsOfType } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';

export function wrappedForTestFunction(func, logger) {
	return function(code) {
		const parseResult = parse(code);
		const forToken = getDescendentsOfType(parseResult.root, ParseTreeTokenType.FOR)[0];
		if (forToken === undefined) {
			logger(`Unexpectedly failed to find a FOR token in parsed code ${code}`);
			return undefined;
		}
		return func(forToken);
	};
};