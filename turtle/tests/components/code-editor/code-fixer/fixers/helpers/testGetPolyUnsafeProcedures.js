import { getPolyUnsafeProcedures } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/getPolyUnsafeProcedures.js';
import { getProceduresMap } from
'../../../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../../../../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function testGetPolyUnsafeProcedures(logger) {
	const cases = [
	{'code': '', 'procs': []},
	{'code': 'to p\nend', 'procs': []},
	{'code': 'to p\noutput 100\nend', 'procs': []},
	{'code': 'to p\npolyStart\nend', 'procs': ['p']},
	{'code': 'to p\npolyEnd\nend', 'procs': ['p']},
	{'code': 'to p\nfd 100\nend', 'procs': ['p']},
	{'code': 'to p1\nfd 100\nend\nto p2\nend', 'procs': ['p1']},
	{'code': 'to p1\nfd 100\nend\nto p2\np1\nend', 'procs': ['p1', 'p2']},
	{'code': 'to p1\nfd 100\nend\nto p2\nbackward 100\nend', 'procs': ['p1', 'p2']},
	{'code': 'to p1\nfd 100\nend\nto p2\np1\nend\nto p3\nend', 'procs': ['p1', 'p2']},
	{'code': 'to p1\nfd 100\nend\nto p2\np1\nend\nto p3\np2\nend', 'procs': ['p1', 'p2', 'p3']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseLogger = new TestParseLogger(plogger, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		if (tree === undefined) {
			plogger(`Expected to parse successfully but failed`);
			return;
		}
		const proceduresMap = getProceduresMap(tree);
		const wCachedTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
		const result = getPolyUnsafeProcedures(wCachedTree);
		if (caseInfo.procs.length !== result.size)
			plogger(`Expected ${caseInfo.procs.length} unsafe procedures but actually got ${result.size}`);
		else {
			for (const p of caseInfo.procs) {
				if (!result.has(p))
					plogger(`Expected to find ${p} unsafe but it was not found in the result.  The result was ${Array.from(result).join(', ')}`);
			}
		}
	});
};