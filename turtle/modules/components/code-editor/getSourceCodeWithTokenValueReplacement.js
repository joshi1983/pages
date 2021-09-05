import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from '../../parsing/parseTreeToCodeWithComments.js';

function isMatch(token1, token2) {
	return token1.lineIndex === token2.lineIndex &&
		token1.colIndex === token2.colIndex;
}

function findMatchingToken(heyStackToken, needleToken) {
	if (isMatch(heyStackToken, needleToken))
		return heyStackToken;
	const children = heyStackToken.children;
	for (let i = 0; i < children.length; i++) {
		const result = findMatchingToken(children[i], needleToken);
		if (result !== undefined)
			return result;
	}
}

export function getSourceCodeWithTokenValueReplacement(oldCode, token, newValue) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(oldCode, parseLogger);
	if (parseLogger.hasLoggedErrors())
		return oldCode; // unable to change the code because we couldn't parse it.
	else {
		const matchingToken = findMatchingToken(tree, token);
		if (matchingToken === undefined)
			return oldCode; // unable to change the code because unable to find matching token.
			// this could mean oldCode doesn't match the code token came from.
			// Maybe the user edited the code between the time token was parsed and the time oldCode was found.

		matchingToken.val = newValue;
		return parseTreeToCodeWithComments(tree, oldCode);
	}
	return oldCode;
};