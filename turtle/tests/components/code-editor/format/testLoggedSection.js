import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { LoggedSection } from '../../../../modules/components/code-editor/format/LoggedSection.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Token } from '../../../../modules/parsing/Token.js';

const token1 = new ParseTreeToken('print', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
const token2 = new ParseTreeToken('Hello', null, 0, 0, ParseTreeTokenType.STRING_LITERAL);
const section1 = new LoggedSection('print', token1, true);
const section2 = new LoggedSection('"Hello', token2, true);
const sections = [section1, section2];

function testBreakAt(logger) {
	const s = '; hello World';
	const commentToken = new Token(s, 0, 0);
	const parsedToken = ParseTreeToken.createFromScannedToken(commentToken, new Set());
	const section = new LoggedSection(s, parsedToken, false);
	const cases = [
		{'index': 30000, 'out': ['; hello World']},
		{'index': 30, 'out': ['; hello World']},
		{'index': 10, 'out': ['; hello', '; World']},
		{'index': 3, 'out': ['; hello', '; World']},
	];
	cases.forEach(function(caseInfo, index) {
		const brokenSections = section.breakAt(caseInfo.index);
		const plogger = prefixWrapper('Case ' + index + ' with input index of ' + caseInfo.index, logger);
		const strings = brokenSections.map(sect => sect.s);
		if (brokenSections.length !== caseInfo.out.length)
			plogger('brokenSections length expected to be ' + caseInfo.out.length + ' but got ' + brokenSections.length + ".  The strings are " + JSON.stringify(strings));
		else {
			if (!DeepEquality.equals(strings, caseInfo.out))
				plogger('Expected ' + JSON.stringify(caseInfo.out) + ' but got ' + JSON.stringify(strings));
		}
	});
}

function testExplode(logger) {
	const joinedSection = LoggedSection.createByJoining(sections);
	const expected = 'print "Hello';
	if (joinedSection.s !== expected)
		logger('s expected to be "' + expected + '" but got "' + joinedSection.s + '"');
	if (joinedSection.token !== token1)
		logger('token expected to be ' + token1 + ' but got ' + joinedSection.token);
	if (joinedSection.isSpacePrefixed !== true)
		logger('isSpacePrefixed expected to be true but got ' + joinedSection.isSpacePrefixed);
	
	const exploded = joinedSection.explode();
	if (!(exploded instanceof Array))
		logger('exploded expected to be an Array but got ' + exploded);
	else if (exploded.length !== 2)
		logger('exploded length expected to be 2 but got ' + exploded.length);
	else {
		const expectedSValues = ['print', '"Hello'];
		const actualSValues = exploded.map(sect => sect.s);
		if (!DeepEquality.equals(expectedSValues, actualSValues))
			logger('Expected is ' + JSON.stringify(expectedSValues) + ' but got ' + JSON.stringify(actualSValues));
	}
}

function testGetStringFromSections(logger) {
	const s = LoggedSection.getStringFromSections(sections);
	const expected = 'print "Hello';
	if (expected !== s)
		logger('Expected to get "' + expected + '" but got "' + s + '"');
	
	const negativeToken = new ParseTreeToken('-', null, 0, 0, ParseTreeTokenType.UNARY_OPERATOR);
	const numToken = new ParseTreeToken(45, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL);
	const negativeSection = new LoggedSection('-', negativeToken, true);
	const numSection = new LoggedSection('45', numToken, false);
	const s2 = LoggedSection.getStringFromSections([negativeSection, numSection]);
	const expected2 = '-45';
	if (expected2 !== s2)
		logger('Expected to get "' + expected2 + '" but got "' + s2 + '"');
}

function testSimpleCases(logger) {
	const token = new ParseTreeToken('print', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const section = new LoggedSection('print', token, true);
	if (section.isExplodable() !== false)
		logger('isExplodable expected to return false but got ' + section.isExplodable());
	const exploded = section.explode();

	if (!(exploded instanceof Array))
		logger('exploded expected to be an Array but it is not');
	else if (exploded.length !== 1)
		logger('Expected exploded to have length 1 but got ' + exploded.length);
	const s = LoggedSection.getStringFromSections([section]);

	if (typeof s !== 'string')
		logger('getStringFromSections expected to be a string but got ' + s);
	else if (s !== 'print')
		logger('getStringFromSections expected to be "print" but got ' + s);
}

export function testLoggedSection(logger) {
	testBreakAt(prefixWrapper('testBreakAt', logger));
	testExplode(prefixWrapper('testExplode', logger));
	testGetStringFromSections(prefixWrapper('testGetStringFromSections', logger));
	testSimpleCases(prefixWrapper('testSimpleCases', logger));
};