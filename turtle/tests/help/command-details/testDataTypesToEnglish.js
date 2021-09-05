import { dataTypesToEnglish } from '../../../modules/help/command-details/dataTypesToEnglish.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testDataTypesToEnglishGeneralCases(logger) {
	const cases = [
		{'in': 'bool', 'out': 'boolean'},
		{'in': 'list', 'out': 'list'},
		{'in': 'null', 'out': 'nothing'},
		{'in': 'num', 'out': 'number'},
		{'in': 'alphacolor|transparent', 'out': 'alphacolor(semitransparent color), transparent'},
		{'in': 'list<num>', 'out': 'list of numbers'},
		{'in': 'list<alphacolor|transparent>', 'out': 'list of elements that are either alphacolor or transparent'},
		{'in': 'list<list<transparent>>', 'out': 'list&lt;list&lt;transparent&gt;&gt;'},
	];
	testInOutPairs(cases, dataTypesToEnglish, logger);
}

function testNotEscapingForHTML(logger) {
	const cases = [
		{'inArgs': ['list<num>'], 'out': 'list of numbers'},
		{'inArgs': ['list<alphacolor|transparent>', false], 'out': 'list of elements that are either alphacolor or transparent'},
		{'inArgs': ['list<list<transparent>>', false], 'out': 'list<list<transparent>>'},
	];
	testInOutPairs(cases, dataTypesToEnglish, logger);
}

export function testDataTypesToEnglish(logger) {
	wrapAndCall([
		testDataTypesToEnglishGeneralCases,
		testNotEscapingForHTML
	], logger);
};