import { dtTokenToParseTreeTokenType } from './dtTokenToParseTreeTokenType.js';
import { getStartIndex } from './getStartIndex.js';
import { getStopIndex } from './getStopIndex.js';
import { getVal } from './getVal.js';
import { isDedent } from './isDedent.js';
import { isEndMarker } from './isEndMarker.js';
import { isIndent } from './isIndent.js';
import { isNewLine } from './isNewLine.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
We convert the third party's parse tree into a more familiar internal structure.
This is to abstract away the DT-python-parser specific structure.

We also want the parse trees resulting from Python 2's parser and Python 3's to be very similar.
Since the underlying grammars for each version are slightly different and most code is automatically 
generated off those different grammars, they'll have a lot of hard-to-detect and hard-to-maintain differences.

Maintaining a consistent parse tree structure using ParseTreeToken, ParseTreeTokenType... regardless of the specific parser helps us
work with the parse tree without much concern for the different versions of Python.
We may also have cases where the DT-python-parser is buggy and we need to work around it.
Such a workaround will be easier to implement using our own data-structure.
*/

export function dtParseTokenToParseTreeToken(token, code, indexToRowColIndex, stopIndexSet) {
	if (stopIndexSet === undefined)
		stopIndexSet = new Set();
	if (token.parentCtx === null && token.children.length > 0)
		token = token.children[0];
	if (isNewLine(token) || isIndent(token) || isDedent(token) || isEndMarker(token))
		return;
	if (token.children === undefined && token.symbol !== undefined &&
	Number.isInteger(token.symbol.stop)) {
		/*
		This is important to work around an apparent bug in DT Python Parser.
		Multiple tokens stop at the same stop index for some inputted Python code.
		This apparent bug would lead to duplicates and overlapping tokens in our
		internal parse tree if it wasn't for the workaround here.

Here is one example of a Python program that was leading to duplicated "1" tokens.
while x < 4:
	print("hi")
	x += 1

Here is another example of a Python program that parsed with tokens "return", "eturn", "n", and yet another "n".
def f():
	return

Aside from overlapping tokens, some tokens with symbol.text 'ENDMARKER' and invokingState 193 are sometimes in the tree.
This workaround is also effective at ignoring those undesirable tokens.

		This workaround works by processing only the first occurance of potentially many duplicates.
		*/
		if (stopIndexSet.has(token.symbol.stop))
			return; /* ignore the token because it duplicates or overlaps representation of a previous token.*/
		else
			stopIndexSet.add(token.symbol.stop);
	}
	const type = dtTokenToParseTreeTokenType(token);
	const val = getVal(token, code, type);
	const startIndex = getStartIndex(token);
	const stopIndex = getStopIndex(token);
	const s = code.substring(startIndex, stopIndex + 1);
	const location = indexToRowColIndex(stopIndex);
	const result = new ParseTreeToken(val, location.lineIndex, location.colIndex, type, s);
	const dtChildren = token.children;
	if (dtChildren !== undefined) {
		for (let i = 0; i < dtChildren.length; i++) {
			const convertedToken = dtParseTokenToParseTreeToken(dtChildren[i], code, indexToRowColIndex, stopIndexSet);
			if (convertedToken !== undefined)
				result.appendChild(convertedToken);
		}
	}
	return result;
};