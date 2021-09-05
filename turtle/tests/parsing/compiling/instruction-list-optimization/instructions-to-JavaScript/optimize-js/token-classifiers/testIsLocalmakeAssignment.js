import { isLocalmakeAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLocalmakeAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsLocalmakeAssignment(logger) {
	const cases = [
	{
		'code': '', 'numResults': 0
	}, {
		'code': 'context.make("x", 0)', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 0)', 'numResults': 1
	}, {
		'code': 'context.make("x", 0);context.make("y", 0)', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 0);context.make("y", 0)', 'numResults': 1
	}, {
		'code': 'context.localmake("x", 0);context.localmake("y", 0)',
		'numResults': 2
	}];
	processTokenCheckTests(cases, isLocalmakeAssignment, logger);
};