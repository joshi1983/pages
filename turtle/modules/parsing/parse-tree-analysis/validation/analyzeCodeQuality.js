import { CachedParseTree } from '../CachedParseTree.js';
import { logAllTips } from '../tip-generators/logAllTips.js';
import { ParseLogger } from '../../loggers/ParseLogger.js';
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
import { validateCreatePList2 } from './validateCreatePList2.js';
import { validateCurvedBracketExpressions } from './validateCurvedBracketExpressions.js';
import { validateDataTypes } from './validateDataTypes.js';
import { validateDistinctForLoopVariableNames } from './validateDistinctForLoopVariableNames.js';
import { validateDrawArcLineShape } from './validateDrawArcLineShape.js';
import { validateDrawArcLineShapes } from './validateDrawArcLineShapes.js';
import { validateDrawingGroupCommands } from './validateDrawingGroupCommands.js';
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
import { validateListsAndExpressions } from './validateListsAndExpressions.js';
import { validateListElementTypes } from './validateListElementTypes.js';
import { validateLocalMakeNotForGlobalVariables } from './validateLocalMakeNotForGlobalVariables.js';
import { validateLongStrings } from './validateLongStrings.js';
import { validateMaxLen } from './validateMaxLen.js';
import { validateMinLen } from './validateMinLen.js';
import { validateMixCalls } from './validateMixCalls.js';
import { validateNotEqual } from './validateNotEqual.js';
import { validateNullInDataList } from './validateNullInDataList.js';
import { validateNumberRanges } from './validateNumberRanges.js';
import { validateOutputAndStopCalls } from './validateOutputAndStopCalls.js';
import { validateOutstandinglyLongProcedures } from './validateOutstandinglyLongProcedures.js';
import { validateOverwrittenParameters } from './validateOverwrittenParameters.js';
import { validatePenUp } from './validatePenUp.js';
import { validatePolyCommandUsage } from './validatePolyCommandUsage.js';
import { validatePolygonCalls } from './validatePolygonCalls.js';
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
import { validateSumOfFirsts } from './validateSumOfFirsts.js';
import { validateSwapCalls } from './validateSwapCalls.js';
import { validateTypeEqualitySymbols } from './validateTypeEqualitySymbols.js';
import { validateUndeclaredVariableRead } from './validateUndeclaredVariableRead.js';
import { validateUnrecognizedParameterizedGroupNames } from './validateUnrecognizedParameterizedGroupNames.js';
import { validateUnusedProcedures } from './validateUnusedProcedures.js';
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
	validateCreatePList2,
	validateCurvedBracketExpressions,
	validateDataTypes,
	validateDistinctForLoopVariableNames,
	validateDrawArcLineShape,
	validateDrawArcLineShapes,
	validateDrawingGroupCommands,
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
	validateListsAndExpressions,
	validateListElementTypes,
	validateLocalMakeNotForGlobalVariables,
	validateLongStrings,
	validateMaxLen,
	validateMinLen,
	validateMixCalls,
	validateNotEqual,
	validateNullInDataList,
	validateNumberRanges,
	validateOutputAndStopCalls,
	validateOutstandinglyLongProcedures,
	validateOverwrittenParameters,
	validatePolyCommandUsage,
	validatePolygonCalls,
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
	validateSumOfFirsts,
	validateSwapCalls,
	validateTypeEqualitySymbols,
	validateUndeclaredVariableRead,
	validateUnrecognizedParameterizedGroupNames,
	validateUnusedVariables,
	validateUselessCode,
	validateVariableNames
];

// validators used in quality report and 
const extraValidators = [
	validateUnusedProcedures
];

const validatorsWithExtra = validators.concat(extraValidators);

export function analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, isCompleteProgram, runExtraValidators) {
	if (runExtraValidators !== undefined && typeof runExtraValidators !== 'boolean')
		throw new Error(`runExtraValidators must either be undefined or boolean but got ${runExtraValidators}`);
	if (runExtraValidators === undefined)
		runExtraValidators = false;
	if (!(parseLogger instanceof ParseLogger))
		throw new Error('parseLogger must be a ParseLogger');
	if (!(proceduresMap instanceof Map))
		throw new Error(`proceduresMap must be a Map. Got ${proceduresMap}`);
	if (!(initialVariablesMap instanceof Map))
		throw new Error(`initialVariablesMap must be a Map. Got ${initialVariablesMap}`);
	if (isCompleteProgram === undefined)
		isCompleteProgram = true;

	const cachedParseTree = new CachedParseTree(tree, proceduresMap, initialVariablesMap);
	let validators2 = runExtraValidators ? validatorsWithExtra : validators;

	logAllTips(cachedParseTree, parseLogger);
	for (const validator of validators2)
		validator(cachedParseTree, parseLogger);
	if (isCompleteProgram === true)
		validatePenUp(cachedParseTree, parseLogger);

};