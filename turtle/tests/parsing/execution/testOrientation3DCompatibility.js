import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testOrientation3DCompatibility(logger) {
	const cases = [
		{'code': 'forward 100\nprint pos', 'messages': ['[0 100 0]']},
		{'code': 'rollRight 90\nforward 100\nprint pos', 'messages': ['[0 100 0]']},
		{'code': 'right 90\nforward 100\nprint pos', 'messages': ['[100 0 0]']},
		{'code': 'right 30\nforward 100\nprint pos', 'messages': ['[50 86.60254 0]']},
		{'code': 'pitchUp 30\nforward 100\nprint (list xCor yCor zCor)', 'messages': ['[0 86.60254 50]']},
		// When run with MSWLogo, the similar code is:
		// perspective uppitch 30 forward 100 print (list xCor yCor zCor)
		// perspective rightRoll 90 forward 100 print (list xCor yCor zCor)
	];

	processExecuterTestCases(cases, logger);
};