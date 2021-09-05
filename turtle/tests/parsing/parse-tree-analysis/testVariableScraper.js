import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';
import { VariableScraper } from '../../../modules/parsing/parse-tree-analysis/VariableScraper.js';

export function testVariableScraper(logger) {
	const cases = [
		{'code': '', 'globals': []},
		{'code': 'fd 100', 'globals': []},
		{'code': 'make "x 0', 'globals': ['x']},
		{'code': 'make "x 0 make "y 1', 'globals': ['x', 'y']},
		{'code': 'make "x 0 to something\nmake "z 0\nend', 'globals': ['x', 'z']},
		{'code': 'repeat 2 [make "x repcount]', 'globals': ['x']},
		{'code': 'to something :x\nprint :x\nmake "x 4\nend\n', 'globals': []},
		{'code': 'to something :x\nprint :x\nmake "X 4\nend\n', 'globals': []},
		{'code': 'to something :X\nprint :x\nmake "x 4\nend\n', 'globals': []},
		{'code': 'to something :X\nprint :x\nmake "x 4\nmake "y 5\nend\n', 'globals': ['y']},
		{'code': 'TO YPLA :SIZE\nTURTLE1 :size\nMAKE "P []\nREPEAT 6 [TURTLE2 :size]\nTURTLE3 :size\nEND', 'globals': ['p']}
	];
	cases.forEach(function(caseInfo) {
		const testParseLogger = new TestParseLogger(logger, caseInfo.code);
		const rootToken = LogoParser.getParseTree(caseInfo.code, testParseLogger);
		if (testParseLogger.hasLoggedErrors())
			logger('Unexpected parse error found in code ' + caseInfo.code + ', messages are ' + JSON.stringify(testLogger.getErrors().map((m) => m.msg)));
		else if (rootToken === null) {
			logger('getParseTree unexpectedly returned null for code ' + caseInfo.code);
		}
		else {
			const globalVariables = VariableScraper.getGlobalVariableNamesMade(ParseTreeToken.flatten(rootToken));
			const prefix = 'Problem while scraping from code: ' + caseInfo.code + '... ';
			if (globalVariables.size !== caseInfo.globals.length)
				logger(prefix + 'Expected ' + caseInfo.globals.length + ' global variables but got ' + globalVariables.size);
			else {
				caseInfo.globals.forEach(function(globalVariable) {
					const index = globalVariables.has(globalVariable);
					if (index === -1)
						logger(prefix + 'Unable to find variable ' + globalVariable + ' in scraped global variables: ' + JSON.stringify(Array.from(globalVariables)));
				});
			}
		}
	});
};