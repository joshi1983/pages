import { testAreTokensEvaluatingEqual } from
'./testAreTokensEvaluatingEqual.js';
import { testCancelDivisions } from
'./testCancelDivisions.js';
import { testGetLogarithmInTokenBase } from
'./testGetLogarithmInTokenBase.js';
import { testSimplifyAll } from
'./testSimplifyAll.js';
import { testSimplifyAllWithVariousExamples } from
'./testSimplifyAllWithVariousExamples.js';
import { testSimplifyBinaryOperators } from
'./testSimplifyBinaryOperators.js';
import { testSimplyByUnwrappingTokens } from
'./testSimplyByUnwrappingTokens.js';
import { testSimplifyCreatePList2 } from
'./testSimplifyCreatePList2.js';
import { testSimplifyForeverBreak } from
'./testSimplifyForeverBreak.js';
import { testSimplifyParameterizedGroups } from
'./testSimplifyParameterizedGroups.js';
import { testSimplifySignSymmetricParameterizedGroups } from
'./testSimplifySignSymmetricParameterizedGroups.js';
import { testSimplifyUnaryOperators } from
'./testSimplifyUnaryOperators.js';
import { testSimplifyWithArcLines } from
'./testSimplifyWithArcLines.js';
import { testSimplifyWithLiterals } from
'./testSimplifyWithLiterals.js';
import { testSimplifyWithPolygon } from
'./testSimplifyWithPolygon.js';
import { testSimplifyWithRadians } from
'./testSimplifyWithRadians.js';
import { testSubstituteLocalConstants } from
'./testSubstituteLocalConstants.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testSimplifiers(logger) {
	wrapAndCall([
		testAreTokensEvaluatingEqual,
		testCancelDivisions,
		testGetLogarithmInTokenBase,
		testSimplifyAll,
		testSimplifyAllWithVariousExamples,
		testSimplifyBinaryOperators,
		testSimplyByUnwrappingTokens,
		testSimplifyCreatePList2,
		testSimplifyForeverBreak,
		testSimplifyParameterizedGroups,
		testSimplifySignSymmetricParameterizedGroups,
		testSimplifyUnaryOperators,
		testSimplifyWithArcLines,
		testSimplifyWithLiterals,
		testSimplifyWithPolygon,
		testSimplifyWithRadians,
		testSubstituteLocalConstants
	], logger);
};