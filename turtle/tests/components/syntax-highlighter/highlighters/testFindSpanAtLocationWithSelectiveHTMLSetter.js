import { codeToHTML } from '../../../../modules/components/syntax-highlighter/codeToHTML.js';
import { findSpanAtLocation } from '../../../../modules/components/syntax-highlighter/highlighters/findSpanAtLocation.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { SelectiveHTMLSetter } from '../../../../modules/components/syntax-highlighter/SelectiveHTMLSetter.js';

/*
Tests findSpanAtLocation integrated with SelectiveHTMLSetter to verify that
it should work for highlighting brackets in updateBracketHighlighting.js.
*/
export function testFindSpanAtLocationWithSelectiveHTMLSetter(logger) {
	const code = `; Inspired by:
; https://www.deviantart.com/vincent-montreuil/art/Ferrari-Profile-Roadster-137752531

to longShadow :width
	localmake "oldState turtleState
	localmake "numSegments 32
	setPenSize 0
	repeat :numSegments [
		localmake "ratio (:numSegments - repcount) / (:numSegments - 1)
		setFillColor mix "white "black :ratio
		localmake "ratio min 1 (0.05 + :ratio * 0.95)
		ellipse :ratio * :width :ratio * :width * 0.03
	]

	setTurtleState :oldState
end`;
	const container = document.createElement('div');
	const setter = new SelectiveHTMLSetter(container);
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const htmlObject = codeToHTML(code, undefined, undefined, 'id');
	setter.setHTMLLines(htmlObject.html.split('\n'));
	const allTokens = cachedParseTree.getAllTokens();
	const lastBracket = allTokens.filter(t => t.val === ']')[0];
	if (lastBracket === undefined) {
		logger(`Expected to find a token with val=']' but did not`);
	}
	else {
		const foundSpan = findSpanAtLocation(container, lastBracket);
		if (foundSpan.tagName !== 'SPAN')
			logger(`tagName expected to be SPAN but got ${foundSpan.tagName}`);
		else if (foundSpan.innerText !== ']')
			logger(`Expected innerText of ] but got ${foundSpan.innerText}`);
	}
};