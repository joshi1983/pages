import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { getUncalledProcedures } from
'../../../../../modules/parsing/parse-tree-analysis/validation/uncalled-procedures/getUncalledProcedures.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testGetUncalledProcedures(logger) {
	const cases = [
	{'code': '', 'names': []},
	{'code': 'to p\nend', 'names': ['p']},
	{'code': 'to p\nend p', 'names': []},
	{'code': 'to p\nend to q\nend\np', 'names': ['q']},
	{'code': 'to p\nq\nend to q\nend\np', 'names': []},
	{'code': 'to animation.snapshotStyle\nend', 'names': []},
	{'code': 'to animation.setup\nend', 'names': []}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const uncalledProcedureNames = getUncalledProcedures(tree);
		if (uncalledProcedureNames.size !== caseInfo.names.length)
			plogger(`Expected ${caseInfo.names.length} uncalled procedures but found ${uncalledProcedureNames.size}`);
		else {
			const resultStr = Array.from(uncalledProcedureNames).join(', ');
			for (const name of caseInfo.names) {
				if (!uncalledProcedureNames.has(name))
					plogger(`Expected ${name} to be uncalled but it was not found in the result: ${resultStr}`);
			}
		}
	});
}