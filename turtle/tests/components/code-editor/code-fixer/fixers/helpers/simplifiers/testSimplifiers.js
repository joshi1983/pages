import { testSimplifyAbs } from
'./testSimplifyAbs.js';
import { testSimplifyAll } from
'./testSimplifyAll.js';
import { testSimplifyCreatePList2 } from
'./testSimplifyCreatePList2.js';
import { testSimplifyForeverBreak } from
'./testSimplifyForeverBreak.js';
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
		testSimplifyAbs,
		testSimplifyAll,
		testSimplifyCreatePList2,
		testSimplifyForeverBreak,
		testSimplifyUnaryOperators,
		testSimplifyWithArcLines,
		testSimplifyWithLiterals,
		testSimplifyWithPolygon,
		testSimplifyWithRadians,
		testSubstituteLocalConstants
	], logger);
};