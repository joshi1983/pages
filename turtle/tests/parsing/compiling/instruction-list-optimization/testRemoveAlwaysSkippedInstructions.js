import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { removeAlwaysSkippedInstructions } from '../../../../modules/parsing/compiling/instruction-list-optimization/removeAlwaysSkippedInstructions.js';

export function testRemoveAlwaysSkippedInstructions(logger) {
	const cases = [
	{
		'instructionsDTO': [],
		'resultLength': 0
	},
	{
		'instructionsDTO': [
			{'name': 'jump', 'newIndex': 1}
		],
		'resultLength': 0
	},
	{
		'instructionsDTO': [
			{'name': 'push', 'value': 100, 'isCloningValue': false},
			{'name': 'jump', 'newIndex': 2}
		],
		'resultLength': 1
	},
	{
		'instructionsDTO': [
			{'name': 'jump', 'newIndex': 2},
			{'name': 'push', 'value': 100, 'isCloningValue': false}
		],
		'resultLength': 0
	},
	{
		'instructionsDTO': [
			{'name': 'jump', 'newIndex': 2},
			{'name': 'push', 'value': 100, 'isCloningValue': false},
			{'name': 'jump-if-true', 'newIndex': 1},
		],
		'resultLength': 3 // no change because the second jump jumps into the interval included by the first jump.
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instructions = instructionsDTOToInstructions(caseInfo.instructionsDTO);
		removeAlwaysSkippedInstructions(instructions);
		if (instructions.length !== caseInfo.resultLength)
			plogger(`Expected length of ${caseInfo.resultLength} but got ${instructions.length}`);
	});
};