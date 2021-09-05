import { testAnalyzeCodeQuality } from './testAnalyzeCodeQuality.js';
import { testRecommendJumpCommands } from './testRecommendJumpCommands.js';
import { testValidateAnimationSetupProcedure } from './testValidateAnimationSetupProcedure.js';
import { testValidateAnimationSnapshotStyleProcedure } from './testValidateAnimationSnapshotStyleProcedure.js';
import { testValidateAnimationTimeUsage } from './testValidateAnimationTimeUsage.js';
import { testValidateArcLines } from './testValidateArcLines.js';
import { testValidateArcsLeftRightUsage } from './testValidateArcsLeftRightUsage.js';
import { testValidateArgumentCounts } from './testValidateArgumentCounts.js';
import { testValidateArrowCalls } from './testValidateArrowCalls.js';
import { testValidateAssert } from './testValidateAssert.js';
import { testValidateBezierCalls } from './testValidateBezierCalls.js';
import { testValidateBinaryOperatorParameters } from './testValidateBinaryOperatorParameters.js';
import { testValidateBreakCommand } from './testValidateBreakCommand.js';
import { testValidateClamp } from './testValidateClamp.js';
import { testValidateClosePathUsage } from './testValidateClosePathUsage.js';
import { testValidateConsecutiveCommands } from './testValidateConsecutiveCommands.js';
import { testValidateDataTypes2 } from './testValidateDataTypes2.js';
import { testValidateDataTypes2SpecialCases } from './testValidateDataTypes2SpecialCases.js';
import { testValidateDistinctForLoopVariableNames } from './testValidateDistinctForLoopVariableNames.js';
import { testValidateEqualLengthList } from './testValidateEqualLengthList.js';
import { testValidateForLoops } from './testValidateForLoops.js';
import { testValidateGradientColorStops } from './testValidateGradientColorStops.js';
import { testValidateIfElseExpressionDataTypes } from './testValidateIfElseExpressionDataTypes.js';
import { testValidateIndependentlyUseful } from './testValidateIndependentlyUseful.js';
import { testValidateInfiniteLoops } from './testValidateInfiniteLoops.js';
import { testValidateInstructionListChildrenAllParameterizedGroups } from './testValidateInstructionListChildrenAllParameterizedGroups.js';
import { testValidateInvoke } from './testValidateInvoke.js';
import { testValidateItemUsage } from './testValidateItemUsage.js';
import { testValidateKeywords } from './testValidateKeywords.js';
import { testValidateLinearGradients } from './testValidateLinearGradients.js';
import { testValidateListElementTypes } from './testValidateListElementTypes.js';
import { testValidateListsAndExpressions } from './testValidateListsAndExpressions.js';
import { testValidateLocalMakeNotForGlobalVariables } from './testValidateLocalMakeNotForGlobalVariables.js';
import { testValidateLongStrings } from './testValidateLongStrings.js';
import { testValidateMaxLen } from './testValidateMaxLen.js';
import { testValidateMinLen } from './testValidateMinLen.js';
import { testValidateMixCalls } from './testValidateMixCalls.js';
import { testValidateNullInDataList } from './testValidateNullInDataList.js';
import { testValidateNumberRanges } from './testValidateNumberRanges.js';
import { testValidateOutputAndStopCalls } from './testValidateOutputAndStopCalls.js';
import { testValidateOverwrittenParameters } from './testValidateOverwrittenParameters.js';
import { testValidatePenUp } from './testValidatePenUp.js';
import { testValidatePolyCommandUsage } from './testValidatePolyCommandUsage.js';
import { testValidateProcedureInProcedure } from './testValidateProcedureInProcedure.js';
import { testValidateProcedureNames } from './testValidateProcedureNames.js';
import { testValidateProcedureParametersNotNull } from './testValidateProcedureParametersNotNull.js';
import { testValidateProcedureParametersUnique } from './testValidateProcedureParametersUnique.js';
import { testValidateQuotes } from './testValidateQuotes.js';
import { testValidateReadCommand } from './testValidateReadCommand.js';
import { testValidateRefTypes } from './testValidateRefTypes.js';
import { testValidateRepcountCalls } from './testValidateRepcountCalls.js';
import { testValidateRepRatioCalls } from './testValidateRepRatioCalls.js';
import { testValidateStringFormats } from './testValidateStringFormats.js';
import { testValidateSwapCalls } from './testValidateSwapCalls.js';
import { testValidateTypeEqualitySymbols } from './testValidateTypeEqualitySymbols.js';
import { testValidateUndeclaredVariableRead } from './testValidateUndeclaredVariableRead.js';
import { testValidateUnrecognizedParameterizedGroupNames } from './testValidateUnrecognizedParameterizedGroupNames.js';
import { testValidateUnusedVariables } from './testValidateUnusedVariables.js';
import { testValidateUnusedVariablesGlobal } from './testValidateUnusedVariablesGlobal.js';
import { testValidateUselessCode } from './testValidateUselessCode.js';
import { testValidateVariableNames } from './testValidateVariableNames.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

const tests = [
testAnalyzeCodeQuality,
testRecommendJumpCommands,
testValidateAnimationSetupProcedure,
testValidateAnimationSnapshotStyleProcedure,
testValidateAnimationTimeUsage,
testValidateArcLines,
testValidateArcsLeftRightUsage,
testValidateArgumentCounts,
testValidateArrowCalls,
testValidateAssert,
testValidateBezierCalls,
testValidateBinaryOperatorParameters,
testValidateBreakCommand,
testValidateClamp,
testValidateClosePathUsage,
testValidateConsecutiveCommands,
testValidateDataTypes2,
testValidateDataTypes2SpecialCases,
testValidateDistinctForLoopVariableNames,
testValidateEqualLengthList,
testValidateForLoops,
testValidateKeywords,
testValidateGradientColorStops,
testValidateIfElseExpressionDataTypes,
testValidateIndependentlyUseful,
testValidateInfiniteLoops,
testValidateInstructionListChildrenAllParameterizedGroups,
testValidateInvoke,
testValidateItemUsage,
testValidateLinearGradients,
testValidateListElementTypes,
testValidateListsAndExpressions,
testValidateLocalMakeNotForGlobalVariables,
testValidateLongStrings,
testValidateMaxLen,
testValidateMinLen,
testValidateMixCalls,
testValidateNullInDataList,
testValidateNumberRanges,
testValidateOutputAndStopCalls,
testValidateOverwrittenParameters,
testValidatePenUp,
testValidatePolyCommandUsage,
testValidateProcedureInProcedure,
testValidateProcedureNames,
testValidateProcedureParametersNotNull,
testValidateQuotes,
testValidateReadCommand,
testValidateRefTypes,
testValidateRepcountCalls,
testValidateRepRatioCalls,
testValidateStringFormats,
testValidateSwapCalls,
testValidateTypeEqualitySymbols,
testValidateUndeclaredVariableRead,
testValidateUnrecognizedParameterizedGroupNames,
testValidateUnusedVariables,
testValidateUnusedVariablesGlobal,
testValidateUselessCode,
testValidateVariableNames
];

export function testValidation(logger) {
	wrapAndCall(tests, logger);
};