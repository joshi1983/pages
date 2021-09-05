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
import { convertSomeBinaryOperatorsToUnary } from './convertSomeBinaryOperatorsToUnary.js';
import { convertSomeFunctionCallsToIdentifiers } from './convertSomeFunctionCallsToIdentifiers.js';
import { convertSomeIdentifiersToFunctionCalls } from './convertSomeIdentifiersToFunctionCalls.js';
import { convertSomeLongStringLiteralsToDocstrings } from './convertSomeLongStringLiteralsToDocstrings.js';
import { convertSomeTupleLiteralsToCurvedBracketExpressions } from './convertSomeTupleLiteralsToCurvedBracketExpressions.js';
import { convertSomeUnaryOperatorsToBinary } from './convertSomeUnaryOperatorsToBinary.js';
import { convertToDictionaryLiterals } from './convertToDictionaryLiterals.js';
import { convertToSubscriptExpressions } from './convertToSubscriptExpressions.js';
import { convertSubscriptsToChildrenOfIdentifiers } from './convertSubscriptsToChildrenOfIdentifiers.js';
import { convertTupleLiteralStructures } from './convertTupleLiteralStructures.js';
import { convertUnaryOperatorStructures } from './convertUnaryOperatorStructures.js';
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
convertSomeBinaryOperatorsToUnary,
convertSomeFunctionCallsToIdentifiers,
convertSomeIdentifiersToFunctionCalls,
convertSomeLongStringLiteralsToDocstrings,
convertSomeTupleLiteralsToCurvedBracketExpressions,
convertSomeUnaryOperatorsToBinary,
convertToDictionaryLiterals,
convertToSubscriptExpressions,
convertSubscriptsToChildrenOfIdentifiers,
convertTupleLiteralStructures,
convertUnaryOperatorStructures,
];

export function restructureParseTree(result) {
	let changesMade = true;
	// Run some sanitizers that doesn't need to run more than once.
	updateForLoopTokenLocations(result);

	/*
	Run all the converters repeatedly until none of them need to make changes.
	*/
	let iterationCount = 0;
	while (changesMade) {
		changesMade = false;
		for (let i = 0; i < conversionFunctions.length; i++) {
			result = simplifyTree(result);
			if (result === undefined)
				return;
			const convert = conversionFunctions[i];
			if (true === convert(result)) {
				changesMade = true;
			}
		}
		iterationCount++;
	}

	return result;
};