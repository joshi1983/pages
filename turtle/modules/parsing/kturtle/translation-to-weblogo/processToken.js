import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAssignmentOperator } from './type-processors/processAssignmentOperator.js';
import { processBinaryOperator } from './type-processors/processBinaryOperator.js';
import { processCodeBlock } from './type-processors/processCodeBlock.js';
import { processFor } from './type-processors/processFor.js';
import { processIf } from './type-processors/processIf.js';
import { processLearn } from './type-processors/processLearn.js';
import { processNumberLiteral } from './type-processors/processNumberLiteral.js';
import { processParameterizedGroup } from './type-processors/processParameterizedGroup.js';
import { processRepeat } from './type-processors/processRepeat.js';
import { processStringLiteral } from './type-processors/processStringLiteral.js';
import { processTreeRoot } from './type-processors/processTreeRoot.js';
import { processVariableReference } from './type-processors/processVariableReference.js';
import { processWhile } from './type-processors/processWhile.js';

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

export function processToken(token, buffer) {
	if (typeof token !== 'object')
		throw new Error(`token must be an object and more specifically a ParseTreeToken.  Not ${token}`);
	const processor = typeProcessors.get(token.type);
	if (processor !== undefined)
		processor(token, buffer);
	else {
		if (token.val !== null)
			buffer.append(token.val + ' ');
		const children = token.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			processToken(child, buffer);
		}
	}
};