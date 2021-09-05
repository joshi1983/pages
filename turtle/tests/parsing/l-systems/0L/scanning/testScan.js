import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from '../../../../../modules/parsing/l-systems/0L/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '; comment', 'tokens': ['; comment']},
		{'code': '; comment\nx', 'tokens': ['; comment', 'x']},
		{'code': 'Axiom X', 'tokens': [
			{'s': 'Axiom', 'colIndex': 4, 'lineIndex': 0},
			{'s': 'X', 'colIndex': 6, 'lineIndex': 0}
		]
		},
		{'code': 'Axiom=X', 'tokens': ['Axiom', '=', 'X']},
		{'code': 'axiom = FX', 'tokens': ['axiom', '=', 'F', 'X']},
		{'code': 'axiom=FX', 'tokens': ['axiom', '=', 'F', 'X']},
		{'code': 'axiom = F++F++F++F++F',
			'tokens': ['axiom', '=', 'F', '+', '+', 'F', '+', '+', 'F', '+', '+', 'F', '+', '+', 'F']
		},
		{'code': 'F -->', 'tokens': [
			{'s': 'F', 'colIndex': 0, 'lineIndex': 0},
			{'s': '-->', 'colIndex': 4, 'lineIndex': 0}
		]},
		{'code': '----F', 'tokens': ['-', '-','-', '-', 'F']},
		{'code': '>-F', 'tokens': ['>', '-', 'F']},
		{'code': 'ø = 1', 'tokens': ['ø', '=', '1']},
		{'code': 'ø = 22.5', 'tokens': ['ø', '=', '22.5']},
		{'code': 'F --> FF', 'tokens': ['F', '-->', 'F', 'F']},
		{'code': 'V -> [+++W][---W]Y', 'tokens': ['V', '->', '[', '+', '+', '+', 'W', ']', '[', '-', '-', '-', 'W', ']', 'Y']},
		{'code': 'V -> YV', 'tokens': ['V', '->', 'Y', 'V']},
		{'code': 'V -> +V\nangle = 20', 'tokens': ['V', '->', '+', 'V',
			{'s': 'angle', 'lineIndex': 1, 'colIndex': 4},
			'=', '20']
		},
		{'code': 'X -> X+YF+', 'tokens': ['X', '->', 'X', '+', 'Y', 'F', '+']},
		{'code': 'X->X', 'tokens': ['X', '->', 'X']},
		{'code': 'length factor = 1.36', 'tokens': ['length', 'factor', '=', '1.36']},
		{'code': 'length factor=1.36', 'tokens': ['length', 'factor', '=', '1.36']},
		{'code': 'String length: 63', 'tokens': ['String', 'length', ':', '63']}
	];
	processScanTestCases(cases, scan, logger);
};