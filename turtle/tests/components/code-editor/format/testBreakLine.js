import { breakLine } from '../../../../modules/components/code-editor/format/breakLine.js';
import { LoggedSection } from '../../../../modules/components/code-editor/format/LoggedSection.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

const token1 = new ParseTreeToken("forward", null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
const token2 = new ParseTreeToken(145, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL);
token1.appendChild(token2);
const section1 = new LoggedSection(token1.val, token1, true);
const section2 = new LoggedSection('' + token2.val, token2, true);

function getIndentationString(num) {
	let result = '';
	for (let i = 0; i < num; i++) {
		result += '\t';
	}
	return result;
}

function simulateShortLine(logger) {
	const sections = [section1, section2];
	const lines1 = breakLine(0, sections);
	const line1 = 'forward 145';
	if (lines1.length !== 1)
		logger('lines1 length expected to be 1 but got ' + lines1.length);
	else if (lines1[0] !== line1)
		logger('Expected line "' + line1 + '" but got "' + lines1[0] + '"');
	const numTabs = 18;
	const lines2 = breakLine(numTabs, sections);
	if (lines2.length !== 2)
		logger('lines2 length expected to be 2 but got ' + lines2.length + '.  The lines are ' + JSON.stringify(lines2));
	else {
		const indentationString = getIndentationString(numTabs);
		const expectedLine0 = indentationString + 'forward';
		const expectedLine1 = indentationString + '145';
		if (expectedLine0 !== lines2[0])
			logger('Expected lines2[0] to be "' + expectedLine0 + '" but got "' + lines2[0] + '"');
		if (expectedLine1 !== lines2[1])
			logger('Expected lines2[1] to be "' + expectedLine1 + '" but got "' + lines2[1] + '"');
	}
}

export function testBreakLine(logger) {
	wrapAndCall([
		simulateShortLine
	], logger);
};