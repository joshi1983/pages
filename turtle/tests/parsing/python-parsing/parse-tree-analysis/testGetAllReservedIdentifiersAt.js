import { CachedParseTree } from
'../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { getAllReservedIdentifiersAt } from
'../../../../modules/parsing/python-parsing/parse-tree-analysis/getAllReservedIdentifiersAt.js';
import { getTokensByType } from
'../../../../modules/parsing/generic-parsing-utilities/getTokensByType.js';
import { asyncInit, parse } from
'../../../../modules/parsing/python-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
await asyncInit();

function getTestToken(cachedParseTree, logger) {
	const matching = getTokensByType(cachedParseTree, ParseTreeTokenType.IDENTIFIER).
		filter(t => t.val === 'x');
	if (matching.length !== 1) {
		const msg = `Expected there to be exactly 1 reference to x but got ${matching.length}`;
		logger(msg);
		throw new Error(msg);
	}
	return matching[0];
}

export function testGetAllReservedIdentifiersAt(logger) {
	const cases = [
	{'in': 'x = 4', 'out': ['x']},
	{'in': 'y = 5\nx = 4', 'out': ['x', 'y']},
	{'in': 'def f():\n\tpass\n\nx = 4', 'out': ['f', 'x']},
	{'in': 'def f():\n\ty=4\n\nx = 4', 'out': ['f', 'x']}, 
	// y is from another function.
	{'in': 'def f():\n\ty=4\n\ndef f2():\n\tz=10\n\tx = 4', 'out': ['f', 'f2', 'x', 'z']} 
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const treeRoot = parse(caseInfo.in);
		const cachedParseTree = new CachedParseTree(treeRoot);
		const token = getTestToken(cachedParseTree, plogger);
		const identifiers = getAllReservedIdentifiersAt(token, cachedParseTree);
		if (identifiers.size !== caseInfo.out.length)
			plogger(`Expected ${caseInfo.out.length} identifiers but got ${identifiers.size}.  Expected ${caseInfo.out.join(',')} but got ${Array.from(identifiers).join(',')}`);
		else {
			for (let i = 0; i < caseInfo.out.length; i++) {
				const e = caseInfo.out[i];
				if (!identifiers.has(e))
					plogger(`Expected to find identifier ${e} but it was not found in ${Array.from(identifiers).join(',')}`);
			}
		}
	});
};