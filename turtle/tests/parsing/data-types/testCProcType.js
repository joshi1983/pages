import { CProcType } from '../../../modules/parsing/data-types/CProcType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Procedure } from '../../../modules/parsing/Procedure.js';
import { processTestCase } from './processTestCase.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

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

function testIsCompatibleWithValue(logger) {
	const cases = [
		{'s': 'red', 'procedures': [], 'out': false},
		{'s': 'hi', 'procedures': [], 'out': false},
		{'s': 'p', 'procedures': [], 'out': false},
		{'s': 'p', 'procedures': ['p'], 'out': true},
	];
	const type = new CProcType();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, s=${caseInfo.s}`, logger);
		const extraInfo = {};
		if (caseInfo.procedures !== undefined) {
			extraInfo.procedures = new Map();
			caseInfo.procedures.forEach(function(p) {
				const nameToken = new ParseTreeToken(p, null, 0, 0, ParseTreeTokenType.LEAF);
				const proc = new Procedure(p, [], nameToken);
				extraInfo.procedures.set(p, proc);
			});
		}
		const result = type.mayBeCompatibleWithValue(caseInfo.s, extraInfo);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
}

export function testCProcType(logger) {
	wrapAndCall([
		testIsCompatible,
		testIsCompatibleWithNumArgs,
		testIsCompatibleWithValue
	], logger);
};