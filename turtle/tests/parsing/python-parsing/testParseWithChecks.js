import { flatten } from '../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getDescendentsOfType } from '../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { asyncInit, parse } from '../../../modules/parsing/python-parsing/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { sleep } from '../../helpers/sleep.js';

export async function testParseWithChecks(logger) {
	const progressIndicator = new ProgressIndicator('Python..testParseWithChecks');
	logger.indicators.push(progressIndicator);
	await asyncInit();
	const cases = [
	{'code': 'print abs(pos) < 1',
	'check': function(tree, logger) {
		const callTokens = getDescendentsOfType(tree, ParseTreeTokenType.FUNCTION_CALL);
		const binTokens = getDescendentsOfType(tree, ParseTreeTokenType.BINARY_OPERATOR);
		const absToken = callTokens.filter(t => t.val === 'abs')[0];
		const lessToken = binTokens.filter(t => t.val === '<')[0];
		if (absToken === undefined)
			logger(`Expected to find abs token but none found`);
		else if (absToken.children.length !== 3)
			logger(`Expected absToken to have 3 children but got ${absToken.children.length}`);
		if (lessToken === undefined)
			logger(`Expected to find < token but not found`);
		else if (lessToken.children.length !== 2)
			logger(`Expected < token to have 2 children but found ${lessToken.children.length}`);
	}
	},
	{'code': 'math.cos(k) - math.cos(k) - 2', 'check': function(tree, logger) {
		const unaryTokens = getDescendentsOfType(tree, ParseTreeTokenType.UNARY_OPERATOR);
		if (unaryTokens.length !== 0)
			logger(`Expected no unary operators but found ${unaryTokens.length}`);
		const binTokensWithTrouble = getDescendentsOfType(tree, ParseTreeTokenType.BINARY_OPERATOR).
		filter(t => t.children.length !== 2);
		if (binTokensWithTrouble.length !== 0) {
			logger(`Expected all binary operators to have 2 children but found ${binTokensWithTrouble.length} with a different number of children`);
		}
		const negativeTwoTokens = getDescendentsOfType(tree, ParseTreeTokenType.NUMBER_LITERAL).
			filter(t => t.val === '-2');
		if (negativeTwoTokens.length !== 0)
			logger(`Expected not to find -2 but got ${negativeTwoTokens.length} NUMBER_LITERAL tokens with value of -2.`);
	}},
	{'code': 'not n', 'check': function(tree, logger) {
		const notTokens = getDescendentsOfType(tree, ParseTreeTokenType.NOT);
		if (notTokens.length !== 1)
			logger(`Expected 1 not token but found ${notTokens.length}`);
		else {
			const notToken = notTokens[0];
			if (notToken.val !== 'not')
				logger(`Expected not token to have val of not but found ${notToken.val}`);
			if (notToken.children.length !== 1)
				logger(`Expected not token to have 1 child but found ${notToken.children.length}`);
		}
	}},
	{'code': `while True:
	hideturtle()
#clcoding.com `, 'check': function(tree, logger) {
	const tokens = flatten(tree).filter(t => typeof t.val === 'string' &&
		/^[a-z]$/i.test(t.val));
	if (tokens.length !== 0) {
		logger(`Did not expect to find a token with a single letter in its val but did.  We found ${tokens.length} such tokens and their letters are ${tokens.map(t => t.val).join(', ')}`);
	}
}}
	];
	for (let ch of 'az09_/+-~!@#$%^&*;:=[]()'.split('')) {
		cases.push({'code': `while True:
		hideturtle()
	#clcoding.com${ch}`, 'check': function(tree, logger) {
		const tokens = flatten(tree).filter(t => t.val === ch &&
			t.lineIndex > 1);
		if (tokens.length !== 0) {
			logger(`Did not expect to find a token with a val of ${ch} after line 1 but did.  We found ${tokens.length} such tokens and their vals are ${tokens.map(t => t.val).join(', ')}`);
		}
	}});
	}
	for (let index = 0; index < cases.length; index++) {
		progressIndicator.setProgressRatio(index / cases.length);
		const caseInfo = cases[index];
		const code = caseInfo.code;
		progressIndicator.setMessage(`..${code.substring(code.length - 3)} ${index} of ${cases.length}`);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = parse(caseInfo.code);
		caseInfo.check(tree, plogger);
		await sleep(100);
	}
	progressIndicator.completed();
};