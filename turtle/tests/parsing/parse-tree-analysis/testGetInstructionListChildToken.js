import { getInstructionListChildToken } from '../../../modules/parsing/parse-tree-analysis/getInstructionListChildToken.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testGetInstructionListChildToken(logger) {
	const code = 'to f\nif 1 < 2 [\n"jik\nprint "xyz\nprint 1 + 3 * "azy]\nprint "abc\nend\nprint "yay\n';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors()) {
		logger('Parsing unexpectedly failed.');
		/*
		The code has some weirdness which would cause warnings in code analysis 
		but we're expecting the parse stage to pass.

		The "jik does nothing, for example.
		*/
		return;
	}
	const cases = [{
		'val': 'xyz',
		'parentType': ParseTreeTokenType.LIST,
		'grandParentType': ParseTreeTokenType.PARAMETERIZED_GROUP
	}, {
		'val': 'jik',
		'type': ParseTreeTokenType.STRING_LITERAL,
		'parentType': ParseTreeTokenType.LIST,
		'grandParentType': ParseTreeTokenType.PARAMETERIZED_GROUP
	}, {
		'val': 'azy',
		'parentType': ParseTreeTokenType.LIST,
		'grandParentType': ParseTreeTokenType.PARAMETERIZED_GROUP
	}, {
		'val': 'abc',
		'parentType': ParseTreeTokenType.LIST,
		'grandParentType': ParseTreeTokenType.PROCEDURE_START_KEYWORD
	}, {
		'val': 'yay',
		'parentType': ParseTreeTokenType.TREE_ROOT
	}
	];
	const tokens = ParseTreeToken.flatten(tree);
	cases.forEach(function(caseInfo) {
		const tokensWithMatchedVal = tokens.filter(t => t.val === caseInfo.val);
		const plogger = prefixWrapper('Failed for val ' + caseInfo.val, logger);
		const expectedType = typeof caseInfo.type === 'number' ? caseInfo.type : ParseTreeTokenType.PARAMETERIZED_GROUP;
		if (tokensWithMatchedVal.length !== 1)
			plogger('Expected 1 token but got ' + tokensWithMatchedVal.length);
		else {
			const result = getInstructionListChildToken(tokensWithMatchedVal[0]);
			if (!(result instanceof ParseTreeToken))
				plogger('Expected to get a ParseTreeToken');
			else if (result.parentNode === null)
				plogger('parentNode expected to not be null but it is null');
			else if (expectedType !== result.type)
				plogger('type expected to be ' + ParseTreeTokenType.getNameFor(expectedType) + ' but got ' + ParseTreeTokenType.getNameFor(result.type));
			else {
				if (result.parentNode.type !== caseInfo.parentType)
					plogger('Expected parentType to be ' + ParseTreeTokenType.getNameFor(caseInfo.parentType) +
						' but got ' + ParseTreeTokenType.getNameFor(result.parentNode.type));
				if (caseInfo.grandParentType !== undefined) {
					if (result.parentNode.parentNode === null)
						plogger('parentNode is unexpectedly null');
					else if (result.parentNode.parentNode.type !== caseInfo.grandParentType)
						plogger('grandparent type expected to be ' + ParseTreeTokenType.getNameFor(caseInfo.grandParentType) +
							' but got ' + ParseTreeTokenType.getNameFor(result.parentNode.parentNode.type));
				}
			}
		}
	});
};