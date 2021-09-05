import { isComment } from './scanning/isComment.js';
import { isIdentifier } from './scanning/isIdentifier.js';
import { isNumberLiteralStart } from './scanning/isNumberLiteralStart.js';
import { isPreprocessorIdentifier } from './scanning/isPreprocessorIdentifier.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { QBasicOperators } from './QBasicOperators.js';

const sToTypeMap = new Map([
	[':', ParseTreeTokenType.COLON],
	[',', ParseTreeTokenType.COMMA],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	[';', ParseTreeTokenType.SEMICOLON],
	['.', ParseTreeTokenType.DOT],
	['as', ParseTreeTokenType.AS],
	['call', ParseTreeTokenType.CALL],
	['case', ParseTreeTokenType.CASE],
	['common', ParseTreeTokenType.COMMON],
	['const', ParseTreeTokenType.CONST],
	['declare', ParseTreeTokenType.DECLARE],
	['def', ParseTreeTokenType.DEF],
	['defdbl', ParseTreeTokenType.DEF_PRIMITIVE],
	['defint', ParseTreeTokenType.DEF_PRIMITIVE],
	['deflng', ParseTreeTokenType.DEF_PRIMITIVE],
	['defsng', ParseTreeTokenType.DEF_PRIMITIVE],
	['defstr', ParseTreeTokenType.DEF_PRIMITIVE],
	['dim', ParseTreeTokenType.DIM],
	['do', ParseTreeTokenType.DO],
	['else', ParseTreeTokenType.ELSE],
	['elseif', ParseTreeTokenType.ELSEIF],
	['end', ParseTreeTokenType.END],
	['exit', ParseTreeTokenType.EXIT],
	['false', ParseTreeTokenType.BOOLEAN_LITERAL],
	['for', ParseTreeTokenType.FOR],
	['function', ParseTreeTokenType.FUNCTION],
	['gosub', ParseTreeTokenType.GOSUB],
	['if', ParseTreeTokenType.IF],
	['let', ParseTreeTokenType.LET],
	['loop', ParseTreeTokenType.LOOP],
	['next', ParseTreeTokenType.NEXT],
	['on', ParseTreeTokenType.ON],
	['option', ParseTreeTokenType.OPTION],
	['redim', ParseTreeTokenType.REDIM],
	['return', ParseTreeTokenType.RETURN],
	['select', ParseTreeTokenType.SELECT],
	['shared', ParseTreeTokenType.SHARED],
	['step', ParseTreeTokenType.STEP],
	['sub', ParseTreeTokenType.SUB],
	['then', ParseTreeTokenType.THEN],
	['true', ParseTreeTokenType.BOOLEAN_LITERAL],
	['type', ParseTreeTokenType.TYPE],
	['until', ParseTreeTokenType.UNTIL],
	['wend', ParseTreeTokenType.WEND],
	['while', ParseTreeTokenType.WHILE],
]);
QBasicOperators.getAllOperatorsInfo().forEach(function(info) {
	sToTypeMap.set(info.symbol, ParseTreeTokenType.BINARY_OPERATOR);
});

const specialValues = Array.from(sToTypeMap.keys());
export { specialValues };

export function stringToTokenType(s, parseForEachLoops) {
	const sLower = s.toLowerCase();
	let type = sToTypeMap.get(sLower);
	if (type !== undefined)
		return type;
	if (parseForEachLoops) {
		if (sLower === 'each')
			return ParseTreeTokenType.EACH;
		if (sLower === 'in')
			return ParseTreeTokenType.IN;
	}
	if (isComment(s))
		return ParseTreeTokenType.COMMENT;
	if (isNumberLiteralStart(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (s[0] === '"')
		return ParseTreeTokenType.STRING_LITERAL;
	if (isIdentifier(s) || isPreprocessorIdentifier(s))
		return ParseTreeTokenType.IDENTIFIER;
	return ParseTreeTokenType.UNMATCHED;
};