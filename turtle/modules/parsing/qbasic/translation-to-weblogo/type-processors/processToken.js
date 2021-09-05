import { genericProcessToken } from
'../../../generic-parsing-utilities/genericProcessToken.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processArgList } from './processArgList.js';
import { processAssignment } from './processAssignment.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processDo } from './processDo.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processLet } from './processLet.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processWhile } from './processWhile.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ARG_LIST, processArgList],
	[ParseTreeTokenType.ASSIGNMENT, processAssignment],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, processCodeBlock],
	[ParseTreeTokenType.CONST, processLet],
	[ParseTreeTokenType.DECLARE, noop],
	[ParseTreeTokenType.DIM, noop],
	[ParseTreeTokenType.DO, processDo],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.LET, processLet],
	[ParseTreeTokenType.REDIM, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.WHILE, processWhile]
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };