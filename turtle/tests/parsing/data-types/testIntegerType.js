import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { processTestCases } from './processTestCases.js';

export function testIntegerType(logger) {
	const intType = DataTypes.createFromName('int');
	const cases = [
		{'s': 'true', 'isCompatible': false}, 
		{'s': 'false', 'isCompatible': false},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false},
		{'s': '3.14', 'isCompatible': false},
		{'s': '3', 'isCompatible': true},
		{'s': '-5', 'isCompatible': true},
		{'s': '0', 'isCompatible': true}
	];
	processTestCases(cases, logger, intType);
};