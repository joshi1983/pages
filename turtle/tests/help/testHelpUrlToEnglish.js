import { DataTypes } from '../../modules/parsing/data-types/DataTypes.js';
import { helpUrlToEnglish } from '../../modules/help/helpUrlToEnglish.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
await DataTypes.asyncInit();

function testAllCases(logger) {
	DataTypes.typesArray.forEach(function(dataType) {
		if (dataType.constructor.helpUrl !== undefined) {
			// Test that it doesn't throw JavaScript error.
			helpUrlToEnglish(dataType.constructor.helpUrl);
		}
	});
}

function testSpecificCases(logger) {
	const cases = [
		{'in': 'boolean.html', 'out': 'boolean'},
		{'in': 'integer.html', 'out': 'integer'},
		{'in': 'list.html', 'out': 'list'},
		{'in': 'number.html', 'out': 'number'},
		{'in': 'property-list.html', 'out': 'property list'},
	];
	testInOutPairs(cases, helpUrlToEnglish, logger);
}

export function testHelpUrlToEnglish(logger) {
	wrapAndCall([
		testAllCases,
		testSpecificCases
	], logger);
};