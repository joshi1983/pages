import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterRandomFunctions(logger) {
	const cases = [
	{'code': 'srand', 'messageCount': 0},
	{'code': 'rerandom', 'messageCount': 0},
	{'code': '(srand 10)', 'messageCount': 0},
	{'code': '(srand 10) print random 10', 'messageCount': 1},
	{'code': 'print random 10', 'messageCount': 1},
	{'code': 'print randomRatio', 'messageCount': 1},
	{'code': 'print pick [1 2 3]', 'messageCount': 1},
	{'code': 'print randomColor', 'messageCount': 1},
	];
	processExecuterTestCases(cases, logger);
};