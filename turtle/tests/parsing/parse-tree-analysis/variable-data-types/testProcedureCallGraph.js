import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ProcedureCallGraph } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/ProcedureCallGraph.js';

export function testProcedureCallGraph(logger) {
	const cases = [
		{'code': '', 'procCalls': []},
		{'code': 'fd 100', 'procCalls': []},
		{'code': 'to p\nend', 'procCalls': []},
		{'code': 'to p1\nend\nto p2\nend', 'procCalls': []},
		{'code': 'to p1\nend\nto p2\np1\nend',
			'procCalls': [
				{'from': 'p2', 'to': 'p1'},
				{'from': 'p1', 'to': 'p2', 'result': false},
				{'from': 'undefined', 'to': 'p2', 'result': false},
				{'from': 'undefined', 'to': 'p1', 'result': false},
			]
		},
		{'code': 'to p1\np2\nend\nto p2\np1\np1\nend',
			'procCalls': [
				{'from': 'p2', 'to': 'p1'},
				{'from': 'p1', 'to': 'p2'}
			]
		},
		{'code': 'to p1\np2\nend\nto p2\np1\nend\nto p3\np2\nend',
			'procCalls': [
				{'from': 'p2', 'to': 'p1'},
				{'from': 'p1', 'to': 'p2'},
				{'from': 'p3', 'to': 'p2'},
				{'from': 'p3', 'to': 'p1'},
				{'from': 'p1', 'to': 'p1'},
				{'from': 'p2', 'to': 'p2'},
				{'from': 'p1', 'to': 'p3', 'result': false},
				{'from': 'p3', 'to': 'p3', 'result': false},
			]
		},
		{'code': 'to p\nend\np',
			'procCalls': [
				{'from': undefined, 'to': 'p'},
				{'from': 'p', 'to': undefined, 'result': false},
				{'from': 'p', 'to': 'p', 'result': false},
			]
		},
		{
			'code': 'to p\nmake "x 5\nEnd\nto p2\np\neNd\nprint :X',
			'procCalls': [
				{'from': 'p2', 'to': 'p'},
				{'from': undefined, 'to': 'p', 'result': false},
				{'from': undefined, 'to': 'p2', 'result': false},
				{'from': 'undefined', 'to': 'p', 'result': false},
				{'from': 'undefined', 'to': 'p2', 'result': false},
				{'from': 'p', 'to': 'p', 'result': false},
				{'from': 'p2', 'to': 'p2', 'result': false},
				{'from': 'p', 'to': 'p2', 'result': false}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const graph = new ProcedureCallGraph(cachedParseTree);
		caseInfo.procCalls.forEach(function(procCall) {
			let expectedResult = procCall.result === undefined || procCall.result === true;
			const fromProc = procCall.from === undefined ? undefined : cachedParseTree.getProcedureByName(procCall.from);
			const toProc = procCall.to === undefined ? undefined : cachedParseTree.getProcedureByName(procCall.to);
			const result = graph.doesProcedureCallProcedure(fromProc, toProc);
			if (result !== expectedResult)
				plogger(`Expected to find call from "${procCall.from}" to "${procCall.to}" but did not find one`);
		});
	});
};