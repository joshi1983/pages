import { nonDataTokenTypes } from
'../../../../../../modules/parsing/other-languages/pascal/turing/parsing/canEvaluateToDataValue.js';

function testNonDataTokenTypes(logger) {
	for (const type of nonDataTokenTypes) {
		if (Number.isInteger(type) === false)
			logger(`Every value in nonDataTokenTypes should be an integer but found ${type}.  Verify that all the referenced types are defined in ParseTreeTokenType.js`);
	}
}

export function testCanEvaluateToDataValue(logger) {
	testNonDataTokenTypes(logger);
};