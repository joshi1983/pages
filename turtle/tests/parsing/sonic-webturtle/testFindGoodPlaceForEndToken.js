import { findGoodPlaceForEndToken } from '../../../modules/parsing/sonic-webturtle/findGoodPlaceForEndToken.js';
import { scan } from '../../../modules/parsing/sonic-webturtle/scanning/scan.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function getEndLineNumber(code) {
	const scanTokens = scan(code);
	const result = findGoodPlaceForEndToken(scanTokens);
	return result.lineIndex;
}

function testLineNumber(logger) {
	const cases = [
	{'in': '#', 'out': 0},
	{'in': '# p\nreturn', 'out': 0},
	{'in': 'end\n# p\nreturn', 'out': 0},
	{'in': 'print 34\nend\n# p\nreturn', 'out': 1}
	];
	testInOutPairs(cases, getEndLineNumber, logger);
}

export function testFindGoodPlaceForEndToken(logger) {
	wrapAndCall([
		testLineNumber
	], logger);
};