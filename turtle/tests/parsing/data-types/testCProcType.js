import { CProcType } from '../../../modules/parsing/data-types/CProcType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { processTestCase } from './processTestCase.js';

function testIsCompatible(logger) {
	const cprocType = DataTypes.createFromName('cproc');
	const cases = [
		{'s': 'true', 'isCompatible': false},
		{'s': '"x', 'isCompatible': true},
		{'s': '"print', 'isCompatible': true},
		{'s': 'end', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false}
	];
	for (let i = 0; i < cases.length; i++) {
		const caseInfo = cases[i];
		processTestCase(caseInfo, logger, cprocType);
	}
}

function testIsCompatibleWithNumArgs(logger) {
	const cprocType = DataTypes.createFromName('cproc:1');
	const cases = [
		{'s': 'true', 'isCompatible': false},
		{'s': '"penDown', 'isCompatible': false},// numArgs is mismatched.
		{'s': '"fd', 'isCompatible': true},
		{'s': '"print', 'isCompatible': true},
	];
	for (let i = 0; i < cases.length; i++) {
		const caseInfo = cases[i];
		processTestCase(caseInfo, logger, cprocType);
	}
}

export function testCProcType(logger) {
	testIsCompatible(prefixWrapper('testIsCompatible', logger));
	testIsCompatibleWithNumArgs(prefixWrapper('testIsCompatibleWithNumArgs', logger));
};