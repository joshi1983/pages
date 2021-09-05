import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { processTestCase } from './processTestCase.js';

export function testGradientType(logger) {
	const intType = DataTypes.createFromName('gradient');
	const cases = [
		{'s': 'true', 'isCompatible': false}, 
		{'s': 'false', 'isCompatible': false},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '[]', 'isCompatible': false},
	];
	for (let i = 0; i < cases.length; i++) {
		const caseInfo = cases[i];
		processTestCase(caseInfo, logger, intType);
	}

};