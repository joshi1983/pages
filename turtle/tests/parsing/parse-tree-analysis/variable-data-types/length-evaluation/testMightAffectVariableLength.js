import { findToken } from '../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { mightAffectVariableLength } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/length-evaluation/mightAffectVariableLength.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

function processTestCases(cases, tokens, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const token = findToken(caseInfo.token, tokens, plogger);
		const result = mightAffectVariableLength(token, 'x');
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but got ${result}`);
	});
}

function testMightAffectVariableLengthGeneral(logger) {
	const code = `make "x []
queue "x 4
setItem 3 "x 9
print "Hi
forward 100
queuE "y 10
prinT :x`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const tokens = cachedParseTree.getAllTokens();
	const cases = [
	{
		'token': {
			'val': 'make'
		},
		'result': true
	},
	{
		'token': {
			'val': 'queue'
		},
		'result': true
	},
	{
		'token': {
			'val': 'prinT'
		},
		'result': false
	},
	{
		'token': {
			'val': 'forward'
		},
		'result': false
	},
	{
		'token': {
			'val': 'queuE'
		},
		'result': false // affects variable y but not x.
	},
	{
		'token': {
			'val': 'print'
		},
		'result': false
	}
	];
	processTestCases(cases, tokens, logger);
}

function testMightAffectVariableLengthRepeat(logger) {
	const code = `repeat :numRadialDots [
			jumpForward 1
			queue "x pos
		]`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const tokens = cachedParseTree.getAllTokens();
	const cases = [{
		'token': {
			'val': 'jumpForward'
		},
		'result': false
	}, {
		'token': {
			'val': 'queue'
		},
		'result': true
	}, {
		'token': {
			'val': 'repeat'
		},
		'result': true
	}];
	processTestCases(cases, tokens, logger);
}

export function testMightAffectVariableLength(logger) {
	testMightAffectVariableLengthGeneral(prefixWrapper('testMightAffectVariableLengthGeneral', logger));
	testMightAffectVariableLengthRepeat(prefixWrapper('testMightAffectVariableLengthRepeat', logger));
};