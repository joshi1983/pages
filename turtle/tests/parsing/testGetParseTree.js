import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { ParseTreeTokenType } from
'../../modules/parsing/ParseTreeTokenType.js';
import { processParseTestCases } from '../helpers/parsing/processParseTestCases.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

function parse(logger) {
	return function(code) {
		const parseLogger = new TestParseLogger(logger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		return {
			'root': tree,
			'comments': []
		};
	}
}

export function testGetParseTree(logger) {
	const cases = [{
		'code': '-:x',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'val': null,
			'children': [
				{'val': '-', 'type': ParseTreeTokenType.UNARY_OPERATOR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ, 'children': []}
				]}
			]
			
		}
	}];
	processParseTestCases(cases, parse(logger), ParseTreeTokenType, logger);
};