import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { processTestCase } from './processTestCase.js';

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
	for (let i = 0; i < cases.length; i++) {
		const caseInfo = cases[i];
		processTestCase(caseInfo, logger, numType);
	}
}

export function testNumberType(logger) {
	testLiteralCases(logger);
};