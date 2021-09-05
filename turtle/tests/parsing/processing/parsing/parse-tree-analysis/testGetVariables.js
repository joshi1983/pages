import { CachedParseTree } from
'../../../../../modules/parsing/processing/parsing/parse-tree-analysis/CachedParseTree.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testGetVariables(logger) {
	const cases = [
	{'code': '', 'numVariables': 0},
	{'code': 'int x;', 'varNames': ['x']},
	{'code': 'int x = 4;', 'varNames': ['x']},
	{'code': 'int x, X;', 'varNames': ['x', 'X']},
	{'code': 'void p(int x) {}', 'varNames': ['x']},
	{'code': 'int x,y,z;', 'varNames': ['x', 'y', 'z']},
	];
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.varNames !== undefined)
			caseInfo.numVariables = caseInfo.varNames.length;
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const cachedParseTree = new CachedParseTree(parseResult.root);
		const variables = cachedParseTree.getVariables();
		if (variables.size !== caseInfo.numVariables)
			plogger(`Expected number of variables to be ${caseInfo.numVariables} but found ${variables.size}`);
		else if (caseInfo.varNames !== undefined) {
			for (const varName of caseInfo.varNames) {
				const variable = variables.get(varName);
				if (variable === undefined)
					plogger(`Expected a variable named ${varName} but could not find it.`);
			}
		}
	});
};