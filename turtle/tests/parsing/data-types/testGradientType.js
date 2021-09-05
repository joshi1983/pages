import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { processTestCases } from './processTestCases.js';

export function testGradientType(logger) {
	const intType = DataTypes.createFromName('gradient');
	const cases = [
		{'s': 'true', 'isCompatible': false}, 
		{'s': 'false', 'isCompatible': false},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '[]', 'isCompatible': false},
	];
	processTestCases(cases, logger, intType);

};