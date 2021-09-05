import { getValidJumpsFromTree } from
'../../../../../modules/parsing/asm-turtle/translation-to-weblogo/jump-conversion/getValidJumpsFromTree.js';
import { parse } from
'../../../../../modules/parsing/asm-turtle/parse.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

function getValidJumpCount(code) {
	const parseResult = parse(code);
	const validJumps = getValidJumpsFromTree(parseResult.root);
	return validJumps.length;
}

function testGetValidJumpCount(logger) {
	const cases = [
	{'in': '', 'out': 0},
	{'in': 'fd 100', 'out': 0},
	{'in': '@@start:', 'out': 0},
	{'in': 'jmp @start', 'out': 0},
	{'in': '@@start: jmp @start', 'out': 1},
	{'in': '@@start: jmp @start jmp @START', 'out': 2},
	{'in': '@@start: jmp @start jmp @START @@end: jmp @end', 'out': 3},
	];
	testInOutPairs(cases, getValidJumpCount, logger);
};

export function testGetValidJumpsFromTree(logger) {
	wrapAndCall([
		testGetValidJumpCount
	], logger);
};