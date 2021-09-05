import { prefixWrapper } from './helpers/prefixWrapper.js';
import { StringBuffer } from '../modules/StringBuffer.js';

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

export function testStringBuffer(logger) {
	testCharacterByCharacter(prefixWrapper('testCharacterByCharacter', logger));
};