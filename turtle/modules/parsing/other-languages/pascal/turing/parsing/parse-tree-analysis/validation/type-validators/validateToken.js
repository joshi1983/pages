import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArgList } from
'./validateArgList.js';
import { validateFunction } from './validateFunction.js';
import { validateIf } from './validateIf.js';
import { validateLoop } from './validateLoop.js';
import { validateParseTreeBasics }  from
'../../../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateResult } from './validateResult.js';
import { validateReturn } from './validateReturn.js';
import { validateUnrecognized } from './validateUnrecognized.js';

const validators = new Map([
	[ParseTreeTokenType.ARG_LIST, validateArgList],
	[ParseTreeTokenType.FORMAL_ARG_LIST, validateArgList],
	[ParseTreeTokenType.FUNCTION, validateFunction],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.LOOP, validateLoop],
	[ParseTreeTokenType.RESULT, validateResult],
	[ParseTreeTokenType.RETURN, validateReturn],
	[ParseTreeTokenType.UNRECOGNIZED, validateUnrecognized],
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
	validateParseTreeBasics(token, parseLogger);
	if (token.type !== ParseTreeTokenType.TREE_ROOT &&
	token.parentNode === null)
		parseLogger.error(`parentNode of a ${ParseTreeTokenType.getNameFor(token.type)} should not be null but it is anyway. val=${token.val}`, token);
};