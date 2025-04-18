import { prefixWrapper } from './helpers/prefixWrapper.js';
import { StringBuffer } from '../modules/StringBuffer.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';

function testCharacterByCharacter(logger) {
	let testString = '; Hello World\nfd 100\nprint "Hello\n';
	for (let i = 0; i < 3; i++)
		testString += testString;
	if (testString.length <= 100)
		logger('Expected to have a test string with at least 100 to more thoroughly test StringBuffer but got length of ' + testString.length);
	const sBuffer = new StringBuffer();
	for (let i = 0; i < testString.length; i++) {
		const c = testString.charAt(i);
		sBuffer.append(c);
		const expected = testString.substring(0, i + 1);
		if (sBuffer.toString() !== expected)
			logger('At i=' + i + ', expected=' + expected + ' but got ' + sBuffer.toString());
	}
	sBuffer.clear();
	if (sBuffer.toString() !== '')
		logger('After clear() toString() should return an empty string but got "' + sBuffer.toString() + '"');
}

function testEndsWith(logger) {
	const cases = [
		{'strings': [], 'in': 'hi', 'result': false},
		{'strings': ['s', 'hello'], 'in': 'hi', 'result': false},
		{'strings': ['hi', 'hello'], 'in': 'hi', 'result': false},
		{'strings': ['h', 'i'], 'in': 'hi', 'result': true},
		{'strings': ['hi'], 'in': 'hi', 'result': true},
		{'strings': ['shi'], 'in': 'hi', 'result': true},
		{'strings': ['s', 'hi'], 'in': 'hi', 'result': true},
		{'strings': ['s', 'h', 'i'], 'in': 'hi', 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, strings: ${JSON.stringify(caseInfo.strings)}`, logger);
		const stringBuffer = new StringBuffer();
		stringBuffer.strings = caseInfo.strings;
		const result = stringBuffer.endsWith(caseInfo.in);
		if (result !== caseInfo.result)
			plogger(`Expected ${caseInfo.result} but got ${result}`);
	});
}

function testIsEmpty(logger) {
	const initResult = (new StringBuffer().isEmpty());
	if (initResult !== true)
		logger(`Expected newly created StringBuffer to be initially empty but got a result of: ${initResult}`);
	const s = new StringBuffer();
	s.append('');
	if (s.isEmpty() !== true)
		logger(`After appending an empty string, expected isEmpty() to return true but got ${s.isEmpty()}`);
	s.append('h');
	if (s.isEmpty() !== false)
		logger(`After appending h, expected isEmpty() to return false but got ${s.isEmpty()}`);
}

function testLineCount(logger) {
	const s = new StringBuffer(2, true);
	if (s.lineCount !== 0)
		logger(`Expected lineCount initially to be 0 but found ${s.lineCount}`);
	s.append(' ');
	if (s.lineCount !== 0)
		logger(`Expected lineCount to be 0 but found ${s.lineCount}`);
	s.append('\n');
	if (s.lineCount !== 1)
		logger(`Expected lineCount to be 1 but found ${s.lineCount}`);
	s.trimRight();
	if (s.lineCount !== 0)
		logger(`After trimRight(), expected lineCount to be 0 but found ${s.lineCount}`);

	s.append('\n\n\n\n');
	if (s.lineCount !== 4)
		logger(`After appending a few new lines, expected lineCount to be 4 but found ${s.lineCount}`);
	s.clear();
	if (s.lineCount !== 0)
		logger(`After clear(), expected lineCount to be 0 but found ${s.lineCount}`);

	s.append('\n\n\n\n');
	for (let i = 3; i >= 0; i--) {
		s.removeFromTail(1);
		if (s.lineCount !== i)
			logger(`After removeFromTail(1), expected lineCount to be ${i} but found ${s.lineCount}`);
	}
}

function testRemoveFromTrail(logger) {
	const cases = [
		{'strings': ['s', 'hello'], 'subcases': [
			{'in': 0, 'out': ['s', 'hello']},
			{'in': 1, 'out': ['s', 'hell']},
			{'in': 4, 'out': ['s', 'h']},
			{'in': 5, 'out': ['s']},
			{'in': 6, 'out': []},
		]},
		{'strings': ['hi', 'hello'], 'subcases': [
			{'in': 6, 'out': ['h']}
		]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, strings: ${JSON.stringify(caseInfo.strings)}`, logger);
		caseInfo.subcases.forEach(function(subcaseInfo) {
			const stringBuffer = new StringBuffer();
			stringBuffer.strings = caseInfo.strings.slice();
			stringBuffer.removeFromTail(subcaseInfo.in);
			if (stringBuffer.strings.length !== subcaseInfo.out.length)
				plogger(`Expected length to be ${subcaseInfo.out.length} but got ${stringBuffer.strings.length}`);
			else {
				for (let i = 0; i < subcaseInfo.out.length; i++) {
					if (subcaseInfo.out[i] !== stringBuffer.strings[i])
						plogger(`Expected index ${i} to be "${subcaseInfo.out[i]}" but got "${stringBuffer.strings[i]}"`);
				}
			}
		});
	});
}

function testTrimFromRight(logger) {
	const cases = [
		{'in': 'hello\n', 'out': 'hello'},
		{'in': 'hello\n\t\r ', 'out': 'hello'},
		{'in': ['hello\n\t\r '], 'out': 'hello'},
		{'in': ['hello', '\n\t\r '], 'outLen': 1, 'out': 'hello'},
		{'in': ['', '\n\t\r '], 'outLen': 0, 'out': ''},
		{'in': [' \t\r\n ', '\n\t\r '], 'outLen': 0, 'out': ''},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const sb = new StringBuffer();
		if (typeof caseInfo.in === 'string')
			sb.append(caseInfo.in);
		else if (caseInfo.in instanceof Array)
			sb.strings = caseInfo.in;
		else
			plogger(`Expected in to either be a string or an Array but got ${caseInfo.in}`);
		sb.trimRight();
		const result = sb.toString();
		if (result !== caseInfo.out)
			plogger(`Expected "${caseInfo.out}" but got "${result}"`);
		else {
			if (caseInfo.outLen !== undefined && sb.strings.length !== caseInfo.outLen)
				plogger(`Expected strings.length to be ${caseInfo.outLen} but got ${strings.length}`);
		}
	});
}

export function testStringBuffer(logger) {
	wrapAndCall([
		testCharacterByCharacter,
		testEndsWith,
		testIsEmpty,
		testLineCount,
		testRemoveFromTrail,
		testTrimFromRight
	], logger);
};