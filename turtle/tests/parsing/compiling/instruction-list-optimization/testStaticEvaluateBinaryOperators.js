import { instructionsDTOToInstructions } from '../../../helpers/instructionsDTOToInstructions.js';
import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { staticEvaluateBinaryOperators } from '../../../../modules/parsing/compiling/instruction-list-optimization/staticEvaluateBinaryOperators.js';

export function testStaticEvaluateBinaryOperators(logger) {
	const cases = [
		{
			'in': [], 'out': []
		},
		{
			'in': [{'name': 'push', 'value': 0, 'isCloningValue': false},
				{'name': 'push', 'value': 1, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '<'}],
			'out': [
				{'name': 'push', 'value': true, 'isCloningValue': false}
			]
		},
		{
			'in': [
				{'name': 'push', 'value': 3, 'isCloningValue': false},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'}
			],
			'out': [
				{'name': 'push', 'value': 5, 'isCloningValue': false},
			]
		},
		{
			'in': [
				{'name': 'push', 'value': 3, 'isCloningValue': false},
				{'name': 'push', 'value': 2, 'isCloningValue': false},
				{'name': 'binary-operator', 'symbol': '+'},
				{'name': 'jump', 'newIndex': 0}
			],
			'out': [
				{'name': 'push', 'value': 5, 'isCloningValue': false},
				{'name': 'jump', 'newIndex': 0}
			]
		}
	];
	cases.forEach(function(caseInfo) {
		const instructions = instructionsDTOToInstructions(caseInfo.in);
		staticEvaluateBinaryOperators(instructions);
		if (instructions.length === caseInfo.out.length) {
			const instructionsDTO = instructions.map(i => i.toDTO());
			if (!DeepEquality.equals(instructionsDTO, caseInfo.out))
				logger('Expected different instructions DTO data.  Expected: ' + JSON.stringify(caseInfo.out) + ' but got ' + JSON.stringify(instructionsDTO));
		}
		else
			logger('Expected length ' + caseInfo.out.length + ' but got ' + instructions.length);
	});
};