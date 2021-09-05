import { CachedParseTree } from '../CachedParseTree.js';
import { logAllTips } from '../tip-generators/logAllTips.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { recommendJumpCommands } from './recommendJumpCommands.js';
import { validateAnimationSetupProcedure } from './validateAnimationSetupProcedure.js';
import { validateAnimationSnapshotStyleProcedure } from './validateAnimationSnapshotStyleProcedure.js';
import { validateAnimationTimeUsage } from './validateAnimationTimeUsage.js';
import { validateArcLines } from './validateArcLines.js';
import { validateArcsLeftRightUsage } from './validateArcsLeftRightUsage.js';
import { validateArgumentCounts } from './validateArgumentCounts.js';
import { validateArrowCalls } from './validateArrowCalls.js';
import { validateAssert } from './validateAssert.js';
import { validateBezierCalls } from './validateBezierCalls.js';
import { validateBinaryOperatorParameters } from './validateBinaryOperatorParameters.js';
import { validateBreakCommand } from './validateBreakCommand.js';
import { validateClamp } from './validateClamp.js';
import { validateClosePathUsage } from './validateClosePathUsage.js';
import { validateConsecutiveCommands } from './validateConsecutiveCommands.js';
import { validateCurvedBracketExpressions } from './validateCurvedBracketExpressions.js';
import { validateDataTypes2 } from './validateDataTypes2.js';
import { validateDistinctForLoopVariableNames } from './validateDistinctForLoopVariableNames.js';
import { validateEqualLengthList } from './validateEqualLengthList.js';
import { validateForLoops } from './validateForLoops.js';
import { validateGradientColorStops } from './validateGradientColorStops.js';
import { validateIfElseExpressionDataTypes } from './validateIfElseExpressionDataTypes.js';
import { validateIndependentlyUseful } from './validateIndependentlyUseful.js';
import { validateInfiniteLoops } from './validateInfiniteLoops.js';
import { validateInstructionListChildrenAllParameterizedGroups } from './validateInstructionListChildrenAllParameterizedGroups.js';
import { validateInvoke } from './validateInvoke.js';
import { validateItemUsage } from './validateItemUsage.js';
import { validateKeywords } from './validateKeywords.js';
import { validateLinearGradients } from './validateLinearGradients.js';
import { validateListsAndExpressions } from './validateListsAndExpressions.js';
import { validateListElementTypes } from './validateListElementTypes.js';
import { validateLocalMakeNotForGlobalVariables } from './validateLocalMakeNotForGlobalVariables.js';
import { validateLongStrings } from './validateLongStrings.js';
import { validateMaxLen } from './validateMaxLen.js';
import { validateMinLen } from './validateMinLen.js';
import { validateMixCalls } from './validateMixCalls.js';
import { validateNullInDataList } from './validateNullInDataList.js';
import { validateNumberRanges } from './validateNumberRanges.js';
import { validateOutputAndStopCalls } from './validateOutputAndStopCalls.js';
import { validateOverwrittenParameters } from './validateOverwrittenParameters.js';
import { validatePenUp } from './validatePenUp.js';
import { validatePolyCommandUsage } from './validatePolyCommandUsage.js';
import { validateProcedureInProcedure } from './validateProcedureInProcedure.js';
import { validateProcedureNames } from './validateProcedureNames.js';
import { validateProcedureParametersNotNull } from './validateProcedureParametersNotNull.js';
import { validateProcedureParametersUnique } from './validateProcedureParametersUnique.js';
import { validateProcedureStartTokens } from './validateProcedureStartTokens.js';
import { validateQuotes } from './validateQuotes.js';
import { validateReadCommand } from './validateReadCommand.js';
import { validateRefTypes } from './validateRefTypes.js';
import { validateRepcountCalls } from './validateRepcountCalls.js';
import { validateRepRatioCalls } from './validateRepRatioCalls.js';
import { validateStringFormats } from './validateStringFormats.js';
import { validateSwapCalls } from './validateSwapCalls.js';
import { validateTypeEqualitySymbols } from './validateTypeEqualitySymbols.js';
import { validateUndeclaredVariableRead } from './validateUndeclaredVariableRead.js';
import { validateUnrecognizedParameterizedGroupNames } from './validateUnrecognizedParameterizedGroupNames.js';
import { validateUnusedVariables } from './validateUnusedVariables.js';
import { validateUselessCode } from './validateUselessCode.js';
import { validateVariableNames } from './validateVariableNames.js';

const validators = [
	recommendJumpCommands,
	validateAnimationSetupProcedure,
	validateAnimationSnapshotStyleProcedure,
	validateAnimationTimeUsage,
	validateArcLines,
	validateArcsLeftRightUsage,
	validateArgumentCounts,
	validateArrowCalls,
	validateAssert,
	validateBezierCalls,
	validateBinaryOperatorParameters,
	validateBreakCommand,
	validateClamp,
	validateClosePathUsage,
	validateConsecutiveCommands,
	validateCurvedBracketExpressions,
	validateDataTypes2,
	validateDistinctForLoopVariableNames,
	validateEqualLengthList,
	validateForLoops,
	validateGradientColorStops,
	validateIfElseExpressionDataTypes,
	validateIndependentlyUseful,
	validateInfiniteLoops,
	validateInstructionListChildrenAllParameterizedGroups,
	validateInvoke,
	validateItemUsage,
	validateKeywords,
	validateLinearGradients,
	validateListsAndExpressions,
	validateListElementTypes,
	validateLocalMakeNotForGlobalVariables,
	validateLongStrings,
	validateMaxLen,
	validateMinLen,
	validateMixCalls,
	validateNullInDataList,
	validateNumberRanges,
	validateOutputAndStopCalls,
	validateOverwrittenParameters,
	validatePolyCommandUsage,
	validateProcedureInProcedure,
	validateProcedureNames,
	validateProcedureParametersNotNull,
	validateProcedureParametersUnique,
	validateProcedureStartTokens,
	validateQuotes,
	validateReadCommand,
	validateRefTypes,
	validateRepcountCalls,
	validateRepRatioCalls,
	validateStringFormats,
	validateSwapCalls,
	validateTypeEqualitySymbols,
	validateUndeclaredVariableRead,
	validateUnrecognizedParameterizedGroupNames,
	validateUnusedVariables,
	validateUselessCode,
	validateVariableNames
];

export function analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram) {
	if (!(parseLogger instanceof ParseLogger))
		throw new Error('parseLogger must be a ParseLogger');
	if (!(proceduresMap instanceof Map))
		throw new Error(`proceduresMap must be a Map. Got ${proceduresMap}`);
	if (!(initialVariablesMap instanceof Map))
		throw new Error(`initialVariablesMap must be a Map. Got ${initialVariablesMap}`);
	if (isCompleteProgram === undefined)
		isCompleteProgram = true;

	const cachedParseTree = new CachedParseTree(tree, proceduresMap, initialVariablesMap);

	logAllTips(cachedParseTree, parseLogger);
	for (let i = 0; i < validators.length; i++)
		validators[i](cachedParseTree, parseLogger);
	if (isCompleteProgram === true)
		validatePenUp(cachedParseTree, parseLogger);

};