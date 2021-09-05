import { exceptionToString } from
'../../../../../../../../modules/exceptionToString.js';
import { getAnalyzedVariables } from
'../../../../../../../../modules/parsing/basic/qbasic/parsing/parse-tree-analysis/variable-data-types/variables/getAnalyzedVariables.js';
import { parse } from
'../../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../../../../../helpers/parsing/basic/qbasicExamples.js';
import { wrapAndCall } from
'../../../../../../../helpers/wrapAndCall.js';

function generalCases(logger) {
	const cases = [
	{'code': '', 'numVariables': 0},
	{'code': 'print 4', 'numVariables': 0},
	{'code': 'let x = 3', 'numVariables': 1},
	{'code': 'for x = 0 to 3', 'numVariables': 1},
	{'code': 'const x = 3', 'numVariables': 1},
	{'code': 'DIM Ants(1 TO NumAnts) AS Ant', 'numVariables': 1},
	{'code': 'sub p(x as integer)', 'numVariables': 1},
	{'code': 'sub p(x as integer, y)', 'numVariables': 2},
	{'code': 'input x', 'numVariables': 1},
	{'code': 'dim x as string\ninput x', 'numVariables': 1},
	{'code': 'line input x', 'numVariables': 1},
	{'code': 'dim x as string\nline input x', 'numVariables': 1},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const result = getAnalyzedVariables(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (result.size !== caseInfo.numVariables)
			plogger(`Expected to find ${caseInfo.numVariables} but found ${result.size}.  The found variables are: ${Array.from(result.keys()).join(',')}`);
	});
}

function runOnAllExamples(logger) {
	qbasicExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${content}`, logger);
		try {
			const parseResult = parse(content);
			const result = getAnalyzedVariables(parseResult.root);
			if (!(result instanceof Map)) {
				plogger(`Expected a Map but found ${result}`);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Failed with error. e=${exceptionToString(e)}`);
		}
	});
}

export function testGetAnalyzedVariables(logger) {
	wrapAndCall([
		generalCases,
		runOnAllExamples
	], logger);
};