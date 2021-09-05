import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { processTestCases } from './processTestCases.js';

function testLiteralCases(logger) {
	const numType = DataTypes.createFromName('num');
	const cases = [
		{'s': 'true', 'isCompatible': false}, 
		{'s': 'false', 'isCompatible': false},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false},
		{'s': '3.14', 'isCompatible': true},
		{'s': '3', 'isCompatible': true},
		{'s': '-5', 'isCompatible': true},
		{'s': '0', 'isCompatible': true}
	];
	processTestCases(cases, logger, numType);
}

export function testNumberType(logger) {
	testLiteralCases(logger);
};