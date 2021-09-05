import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArgList } from './validateArgList.js';
import { validateArrayDimensionIndicator } from './validateArrayDimensionIndicator.js';
import { validateElse } from './validateElse.js';
import { validateIf } from './validateIf.js';
import { validateWhile } from './validateWhile.js';

const validators = new Map([
	[ParseTreeTokenType.ARG_LIST, validateArgList],
	[ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR, validateArrayDimensionIndicator],
	[ParseTreeTokenType.ELSE, validateElse],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.WHILE, validateWhile],
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};