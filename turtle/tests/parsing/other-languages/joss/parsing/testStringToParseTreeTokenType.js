import { valTypesMap } from
'../../../../../modules/parsing/other-languages/joss/parsing/stringToParseTreeTokenType.js';

export function testStringToParseTreeTokenType(logger) {
	for (const [key, type] of valTypesMap) {
		if (!Number.isInteger(type))
			logger(`Every value in valTypesMap should be an integer but found ${type} for key ${key}`);
	}
};