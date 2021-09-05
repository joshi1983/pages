import { callDemoProcedureFixer } from
'../../../../modules/parsing/turtle-graphics-fun/translation-to-weblogo/callDemoProcedureFixer.js';
import { processTestCases } from
'../../../components/code-editor/code-fixer/fixers/processTestCases.js';

export function testCallDemoProcedureFixer(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'to p\nend\np', 'logged': false},
		{'code': 'to p\nend',
		'to': 'to p\nend \np',
		'logged': true},
		{'code': 'to p :x\nend',
		'to': 'to p :x\nend \np 100',
		'logged': true},
		{'code': 'to demo\nend',
		'to': 'to demo\nend \ndemo',
		'logged': true},
		{'code': 'to p\nend\nto demo\nend',
		'to': 'to p\nend\nto demo\nend \ndemo',
		'logged': true}, // prefer calling demo over p.
		{'code': 'to demo\nend\nto p\nend',
		'to': 'to demo\nend\nto p\nend \ndemo',
		'logged': true}, // prefer calling demo over p.
	];
	processTestCases(cases, callDemoProcedureFixer, logger);
};