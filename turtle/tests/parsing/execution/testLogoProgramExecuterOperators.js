import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterOperators(logger) {
	const cases = [
		{'code': 'print bitShiftLeft 0 0', 'messages': ['0']},
		{'code': 'print bitShiftLeft 1 1', 'messages': ['2']},
		{'code': 'print bitShiftLeft 1 2', 'messages': ['4']},
		{'code': 'print bitShiftLeft 5 1', 'messages': ['10']},
		{'code': 'print bitShiftLeft 5 2', 'messages': ['20']},
		{'code': 'print bitShiftRight 5 1', 'messages': ['2']},
		{'code': 'print bitShiftRight 5 0', 'messages': ['5']},
		{'code': 'print bitShiftLeft -1 1', 'messages': ['-2']},
		{'code': 'print bitShiftRight -5 1', 'messages': ['-3']},
	];
	processExecuterTestCases(cases, logger);
};