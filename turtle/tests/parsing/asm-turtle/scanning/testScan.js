import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/asm-turtle/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{'code': '', 'len': 0},
	{'code': '//hi world', 'len': 1, 'tokens': ['//hi world']},
	{'code': '//hi\n//world', 'len': 2, 'tokens': ['//hi', '//world']},
	{'code': 'instr', 'len': 1, 'tokens': ['instr']},
	{'code': 'var', 'len': 1, 'tokens': ['var']},
	{'code': 'fd 100', 'len': 2, 'tokens': ['fd', '100']},
	{'code': '@@start:', 'len': 2, 'tokens': ['@@start', ':']},
	{'code': 'cmp x,360', 'len': 4, 'tokens': ['cmp', 'x', ',', '360']},
	{'code': 'jmp @start', 'len': 2, 'tokens': ['jmp', '@start']},
	{'code': 'inc x // increase the size of the square', 'len': 3, 'tokens': ['inc', 'x', '// increase the size of the square']}
	];
	processScanTestCases(cases, scan, logger);
};