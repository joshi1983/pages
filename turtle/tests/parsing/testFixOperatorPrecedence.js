import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { fixOperatorPrecedence } from '../../modules/parsing/fixOperatorPrecedence.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testFixOperatorPrecedence(logger) {
	const cases = [
		{'expr': '1', 'totalExprTokens': 1, 'topTokenVal': 1},
		{'expr': '1+2', 'totalExprTokens': 3, 'topTokenVal': '+'},
		{'expr': '1+2*3', 'totalExprTokens': 5, 'topTokenVal': '+'},
		{'expr': '1+3*2', 'totalExprTokens': 5, 'topTokenVal': '+'},
		{'expr': '2*3+1', 'totalExprTokens': 5, 'topTokenVal': '+'},
		{'expr': '5/4', 'totalExprTokens': 3, 'topTokenVal': '/'},
		{'expr': '1+5/4', 'totalExprTokens': 5, 'topTokenVal': '+'},
		{'expr': '5/4+1', 'totalExprTokens': 5, 'topTokenVal': '+'},
		{'expr': '2*3/4', 'totalExprTokens': 5, 'topTokenVal': '/'},
		{'expr': '3*2/4', 'totalExprTokens': 5, 'topTokenVal': '/'},
		{'expr': '1+3*2/4', 'totalExprTokens': 7, 'topTokenVal': '+'},
		{'expr': '1+3*2/4-4', 'totalExprTokens': 9, 'topTokenVal': '-'},
	];
	cases.forEach(function(caseInfo) {
		const prefixedLogger = prefixWrapper('Problem while processing expression: ' + caseInfo.expr, logger);
		const code = 'print ' + caseInfo.expr;
		const testLogger = new TestParseLogger(prefixedLogger, code);
		const rootToken = LogoParser.getParseTree(code, testLogger);
		if (testLogger.hasLoggedErrors())
			prefixedLogger('Parsing error found.');
		else {
			for (let i = 0; i < 2; i++) {
				fixOperatorPrecedence(rootToken);
				const childTokens = rootToken.children;
				var printCommandToken;
				if (childTokens.length > 2)
					prefixedLogger('Expected no more than 2 tokens but got ' + childTokens.length);
				if (childTokens.length > 0)
					printCommandToken = childTokens[0];
				else
					prefixedLogger('Expected to find at least 1 token but got none');
				if (printCommandToken instanceof ParseTreeToken) {
					if (printCommandToken === printCommandToken.children[0])
						prefixedLogger('cycle detected.  Parent is its own child.');
					else if (printCommandToken.val !== 'print')
						prefixedLogger('Expected first token to be print but got ' + childTokens[0].val + ', type: ' + ParseTreeTokenType.getNameFor(childTokens[0].type));
					else {
						var parameterToken;
						if (printCommandToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
							parameterToken = printCommandToken.children[0];
						else
							parameterToken = childTokens[1];
						if (parameterToken.countNodes() !== caseInfo.totalExprTokens)
							prefixedLogger('Expected ' + caseInfo.totalExprTokens + ' expression tokens but got ' + parameterToken.countNodes());
						if (parameterToken.val !== caseInfo.topTokenVal)
							prefixedLogger('Expected ' + caseInfo.topTokenVal + ' as top expression token but got ' + parameterToken.val);
					}
				}
			}
		}
	});
};