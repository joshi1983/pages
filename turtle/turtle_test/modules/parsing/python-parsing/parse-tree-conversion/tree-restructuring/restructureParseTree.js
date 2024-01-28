import { convertArgumentStarStructures } from './convertArgumentStarStructures.js';
import { convertAssignmentOperatorStructures } from './convertAssignmentOperatorStructures.js';
import { convertBinaryOperatorStructures } from './convertBinaryOperatorStructures.js';
import { convertDotStructures } from './convertDotStructures.js';
import { convertFunctionCallStructures } from './convertFunctionCallStructures.js';
import { convertFunctionDefinitionStructures } from './convertFunctionDefinitionStructures.js';
import { convertGlobalStructures } from './convertGlobalStructures.js';
import { convertInToBinaryOperator } from './convertInToBinaryOperator.js';
import { convertListLiteralStructures } from './convertListLiteralStructures.js';
import { convertMethodCallsToFunctionCalls } from './convertMethodCallsToFunctionCalls.js';
import { convertNegativeOperatorToSignWithNumberLiterals } from './convertNegativeOperatorToSignWithNumberLiterals.js';
import { convertNotInStructures } from './convertNotInStructures.js';
import { convertPrintTokenStructures } from './convertPrintTokenStructures.js';
import { convertReturnStructures } from './convertReturnStructures.js';
import { convertSomeFunctionCallsToIdentifiers } from './convertSomeFunctionCallsToIdentifiers.js';
import { convertSomeIdentifiersToFunctionCalls } from './convertSomeIdentifiersToFunctionCalls.js';
import { convertSomeLongStringLiteralsToDocstrings } from './convertSomeLongStringLiteralsToDocstrings.js';
import { convertSomeTupleLiteralsToCurvedBracketExpressions } from './convertSomeTupleLiteralsToCurvedBracketExpressions.js';
import { convertToSubscriptExpressions } from './convertToSubscriptExpressions.js';
import { convertSubscriptsToChildrenOfIdentifiers } from './convertSubscriptsToChildrenOfIdentifiers.js';
import { convertTupleLiteralStructures } from './convertTupleLiteralStructures.js';
import { convertUnaryOperatorStructures } from './convertUnaryOperatorStructures.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { simplifyTree } from './simplifyTree.js';
import { updateForLoopTokenLocations } from './updateForLoopTokenLocations.js';

const conversionFunctions = [
convertArgumentStarStructures,
convertAssignmentOperatorStructures,
convertBinaryOperatorStructures,
convertDotStructures,
convertFunctionCallStructures,
convertFunctionDefinitionStructures,
convertGlobalStructures,
convertInToBinaryOperator,
convertListLiteralStructures,
convertMethodCallsToFunctionCalls,
convertNegativeOperatorToSignWithNumberLiterals,
convertNotInStructures,
convertPrintTokenStructures,
convertReturnStructures,
convertSomeFunctionCallsToIdentifiers,
convertSomeIdentifiersToFunctionCalls,
convertSomeLongStringLiteralsToDocstrings,
convertSomeTupleLiteralsToCurvedBracketExpressions,
convertToSubscriptExpressions,
convertSubscriptsToChildrenOfIdentifiers,
convertTupleLiteralStructures,
convertUnaryOperatorStructures
];

function isProblemDetected(token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && token.children.length === 1)
		return true;
	if (token.children.length === 2 &&
	token.children[0].type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;
	for (let i = 0; i < token.children.length; i++) {
		if (isProblemDetected(token.children[i]))
			return true;
	}
	return false;
}

export function restructureParseTree(result) {
	let changesMade = true;
	// Run some sanitizers that doesn't need to run more than once.
	updateForLoopTokenLocations(result);

	/*
	Run all the converters repeatedly until none of them need to make changes.
	*/
	let iterationCount = 0;
	/*if (isProblemDetected(result)) {
		console.error('result=', result);
		throw new Error('problem detected before even getting started with restructuring.');
	}*/
	while (changesMade) {
		changesMade = false;
		for (let i = 0; i < conversionFunctions.length; i++) {
			result = simplifyTree(result);
			if (result === undefined)
				return;
			if (true === conversionFunctions[i](result))
				changesMade = true;
		}
		iterationCount++;
	}
	return result;
};