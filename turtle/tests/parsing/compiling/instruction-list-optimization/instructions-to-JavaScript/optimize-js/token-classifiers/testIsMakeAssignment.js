import { isMakeAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isMakeAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsMakeAssignment(logger) {
	const cases = [
	{
		'code': '', 'numResults': 0
	}, {
		'code': 'context.make("x", 0)', 'numResults': 1
	}, {
		'code': 'context.make("x", "hi")', 'numResults': 1
	}, {
		'code': 'context.localmake("x", 0)', 'numResults': 0
	}, {
		'code': 'context.localmake("x", "hi")', 'numResults': 0
	}, {
		'code': 'context.make("x", 0);context.make("y", 0)', 'numResults': 2
	}, {
		'code': 'context.localmake("x", 0);context.make("y", 0)', 'numResults': 1
	}, {
		'code': 'context.localmake("x", 0);context.localmake("y", 0)',
		'numResults': 0
	}];
	processTokenCheckTests(cases, isMakeAssignment, logger);
};