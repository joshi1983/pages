import { Command } from
'../../../../../../modules/parsing/Command.js';
import { convertLoopsToForever, namesOfInterest } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/convertLoopsToForever.js';
import { processTestCases } from '../processTestCases.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';
await Command.asyncInit();

function testConvertLoopsToForeverWithCode(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'forever []', 'logged': false},
		{'code': `do.while [
] false`, 'logged': false},
		{'code': `while x [
]`, 'logged': false},
		{'code': `while :x [
]`, 'logged': false},
		{'code': `repeat 2 [
]`, 'logged': false},
		{'code': `for ["i 0 10] [
]`, 'logged': false},
		{'code': `until true [
]`, 'logged': false},
		{'code': `while true [
]`, 'to': `forever  [
]`, 'logged': true},
		{'code': `do.while [
] true`, 'to': `forever [
] `, 'logged': true},
		{'code': `until false [
]`, 'to': `forever  [
]`, 'logged': true}
	];
	processTestCases(cases, convertLoopsToForever, logger);
}

function testNamesOfInterest(logger) {
	for (const name of namesOfInterest.keys()) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find a Command named ${name}`);
		else {
			const nonInstructionListParams = info.args.filter(a => a.types !== 'instructionlist');
			if (nonInstructionListParams.length !== 1)
				logger(`Expected nonInstructionListParams.length to be 1 but found ${nonInstructionListParams.length}`);
			if (info.args.length !== 2)
				logger(`Expected info.args.length to be 2 but found ${info.args.length}`);
		}
	}
}

export function testConvertLoopsToForever(logger) {
	wrapAndCall([
		testConvertLoopsToForeverWithCode,
		testNamesOfInterest
	], logger);
};