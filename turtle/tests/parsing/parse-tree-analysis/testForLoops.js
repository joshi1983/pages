import { ForLoops } from '../../../modules/parsing/parse-tree-analysis/ForLoops.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

function testGetForLoops(logger) {
	const cases = [
	{'code': '', 'numForLoops': 0, 'variableNames': [], 'dataTypes': []},
	{'code': 'print 5', 'numForLoops': 0, 'variableNames': [], 'dataTypes': []},
	{'code': 'repeat 10 [print repcount]', 'numForLoops': 0, 
		'variableNames': [], 'dataTypes': []},
	{'code': 'for ["x 1 5 1] [print :x]', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['int']},
	{'code': 'for ["X 1 5 1] [print :X]', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['int']},
	{'code': 'to hi\nfor ["x 1 5 1] [print :x]\nend', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['int']},
	{'code': 'to hi\nfor ["x 1 5.5 1] [print :x]\nend', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['int']},
	{'code': 'to hi\nfor ["x 1 5.5] [print :x]\nend', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['int']},
	{'code': 'to hi\nfor ["x 1.5 5] [print :x]\nend', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['num']},
	{'code': 'to hi\nfor ["x 1 + 3 5] [print :x]\nend', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['int']},
	{'code': 'to hi\nfor ["x 1 + 3.5 5] [print :x]\nend', 'numForLoops': 1,
		'variableNames': ['x'], 'dataTypes': ['num']},
	{'code': 'for ["y 1 5 1] [for ["x 1 5 1] [print :x]]', 'numForLoops': 2,
		'variableNames': ['y', 'x'], 'dataTypes': ['int', 'int']},
	{'code': 'print 10\nfor ["x 1 5 1] [print :x]\nfor ["x 1 5 1] [print :x]',
		'numForLoops': 2, 'variableNames': ['x', 'x'], 'dataTypes': ['int', 'int']},
	{'code': 'print 10\nfor ["x 1 5 0.1] [print :x]\nfor ["x 1 5 1] [print :x]',
		'numForLoops': 2, 'variableNames': ['x', 'x'], 'dataTypes': ['num', 'int']},
	{'code': 'for (list "x 1 5 1) [print :x]', 'variableNames': ['x'], 'dataTypes': ["int"],
		'numForLoops': 1}
	];
	cases.forEach(function(caseInfo) {
		const parseLogger = new TestParseLogger(logger, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		const tokens = ParseTreeToken.flatten(tree);
		const forTokens = ForLoops.getForLoops(tokens);
		const prefixLogger = prefixWrapper('Failed with code ' + caseInfo.code, logger);
		if (forTokens.length !== caseInfo.numForLoops)
			prefixLogger('Expected ' + caseInfo.numForLoops + ' but got ' + forTokens.length);
		else {
			forTokens.forEach(function(token, index) {
				const actualVarName = ForLoops.getVariableName(token);
				const actualDataType = ForLoops.getDataTypeWithForLoop(token);
				const expectedVarName = caseInfo.variableNames[index];
				const expectedDataType = caseInfo.dataTypes[index];
				if (actualVarName !== expectedVarName)
					prefixLogger('Expected variable name of ' + expectedVarName + ' but got ' + actualVarName);
				if (actualDataType !== expectedDataType)
					prefixLogger('Expected data type of ' + expectedDataType + ' but got ' + actualDataType);
			});
		}
	});
}

export function testForLoops(logger) {
	testGetForLoops(logger);
};