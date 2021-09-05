import { findToken } from
'../../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { moveArgsForParameterizedGroup } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/moveArgsForParameterizedGroup.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testMoveArgsForParameterizedGroup(logger) {
	const cases = [
	{'code': 'p',
	'token': {'val': 'p'},
	'checks': [
		{
			'numExpected': 0, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 0
		},
		{
			'numExpected': 1, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 0
		},
	]},
	{'code': 'p 100',
	'token': {'val': 'p'},
	'checks': [
		{
			'numExpected': 0, 'afterRootChildrenLength': 2,
			'afterTokenChildrenLength': 0
		},
		{
			'numExpected': 1, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 1
		},
	]},
	{'code': 'print p 100',
	'token': {'val': 'p'},
	'checks': [
		{
			'numExpected': 0, 'afterRootChildrenLength': 2,
			'afterTokenChildrenLength': 0
		},
		{
			'numExpected': 1, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 1
		},
	]},
	{'code': 'print (p 100)',
	'token': {'val': 'p'},
	'checks': [
		{
			'numExpected': 0, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 0
		},
		{
			'numExpected': 1, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 1
		},
		{// trying to get 2 but only 1 token should get added due to the ')'.
			'numExpected': 2, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 1
		},
		{// same should happen any number over 1 due to ')'.
			'numExpected': 200, 'afterRootChildrenLength': 1,
			'afterTokenChildrenLength': 1
		},
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}, numExpected: ${checkInfo.numExpected}`, plogger);
			if (!Number.isInteger(checkInfo.numExpected)) {
				clogger(`The expectedNum must be an integer but found ${checkInfo.numExpected}`);
				return;
			}
			const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, clogger, true);
			if (cachedParseTree !== undefined) {
				const allTokens = cachedParseTree.getAllTokens();
				const token = findToken(caseInfo.token, allTokens, clogger);
				if (token !== undefined) {
					moveArgsForParameterizedGroup(token, checkInfo.numExpected);
					const rootChildLength = cachedParseTree.root.children.length;
					if (rootChildLength !== checkInfo.afterRootChildrenLength)
						clogger(`Expected tree root children.length to be ${checkInfo.afterRootChildrenLength} but found ${rootChildLength}`);
					const tokenChildLength = token.children.length;
					if (tokenChildLength !== checkInfo.afterTokenChildrenLength)
						clogger(`Expected token.children.length to be ${checkInfo.afterTokenChildrenLength} but found ${tokenChildLength}`);
				}
			}
		});
	});
}
