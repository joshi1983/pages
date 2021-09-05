import { genericProcessToken } from '../../../generic-parsing-utilities/genericProcessToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processFor } from './processFor.js';
import { processIf } from './processIf.js';
import { processLearn } from './processLearn.js';
import { processNumberLiteral } from './processNumberLiteral.js';
import { processParameterizedGroup } from './processParameterizedGroup.js';
import { processRepeat } from './processRepeat.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processTreeRoot } from './processTreeRoot.js';
import { processVariableReference } from './processVariableReference.js';
import { processWhile } from './processWhile.js';

const typeProcessors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, processCodeBlock],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.LEARN, processLearn],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, processParameterizedGroup],
	[ParseTreeTokenType.REPEAT, processRepeat],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.TREE_ROOT, processTreeRoot],
	[ParseTreeTokenType.VARIABLE_REFERENCE, processVariableReference],
	[ParseTreeTokenType.WHILE, processWhile],
]);

const processToken = genericProcessToken(typeProcessors);
export { processToken };