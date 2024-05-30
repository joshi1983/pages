import { processToRowEchelonForm } from
'../../../modules/drawing/vector/processToRowEchelonForm.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function wrappedProcessToRowEchelonForm(m) {
	processToRowEchelonForm(m);
	return m;
}

export function testProcessToRowEchelonForm(logger) {
	const cases = [
	{'in': [
	[1, 0],
	[0, 1]
	], 'out': [
	[1, 0],
	[0, 1]
	]},
	{'in': [
	[0, 1],
	[1, 0]
	], 'out': [
	[1, 0],
	[0, 1]
	]},
	{'in': [
	[0, 1, 3],
	[1, 0, 2]
	], 'out': [
	[1, 0, 2],
	[0, 1, 3]
	]},
	{'in': [
	[0, 1, 3],
	[2, 0, 4]
	], 'out': [
	[1, 0, 2],
	[0, 1, 3]
	]},
	{'in': [
	[0, 2, 6],
	[1, 1, 1]
	], 'out': [
	[1, 0, -2],
	[0, 1, 3]
	]}
	];
	testInOutPairs(cases, wrappedProcessToRowEchelonForm, logger);
};