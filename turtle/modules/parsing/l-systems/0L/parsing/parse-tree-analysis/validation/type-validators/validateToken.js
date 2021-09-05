import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArrow } from './validateArrow.js';
import { validateAssignment } from './validateAssignment.js';
import { validateIdentifier } from './validateIdentifier.js';
import { validateNumberLiteral } from './validateNumberLiteral.js';
import { validateParseTreeBasics }  from
'../../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateTreeRoot } from './validateTreeRoot.js';
import { validateUnrecognized } from './validateUnrecognized.js';

const validators = new Map([
	[ParseTreeTokenType.ARROW, validateArrow],
	[ParseTreeTokenType.ASSIGNMENT, validateAssignment],
	[ParseTreeTokenType.IDENTIFIER, validateIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, validateNumberLiteral],
	[ParseTreeTokenType.TREE_ROOT, validateTreeRoot],
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