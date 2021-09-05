import { testCodeToElement } from './testCodeToElement.js';
import { testCodeToHTML } from './testCodeToHTML.js';
import { testContextMenuDirectory } from './context-menu/testContextMenuDirectory.js';
import { testEscapeSpecialCharacters } from './testEscapeSpecialCharacters.js';
import { testGetCSSClassNameForParseToken } from './testGetCSSClassNameForParseToken.js';
import { testGetStringSourceForToken } from './testGetStringSourceForToken.js';
import { testGetTextPositionFromElement } from './testGetTextPositionFromElement.js';
import { testHighlightLogoSyntaxInCodeElement } from './testHighlightLogoSyntaxInCodeElement.js';
import { testHighlightLogoSyntaxInTextarea } from './testHighlightLogoSyntaxInTextarea.js';
import { testHighlighters } from './highlighters/testHighlighters.js';
import { testProcessorsDirectory } from './processors/testProcessorsDirectory.js';
import { testSelectiveHTMLSetter } from './testSelectiveHTMLSetter.js';
import { testSimulatedEditing } from './testSimulatedEditing.js';
import { testTextareaContextMenu } from './testTextareaContextMenu.js';
import { testTokenHTMLProcessors } from './token-html-processors/testTokenHTMLProcessors.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSyntaxHighlighter(logger) {
	wrapAndCall([
		testCodeToElement,
		testCodeToHTML,
		testContextMenuDirectory,
		testEscapeSpecialCharacters,
		testGetCSSClassNameForParseToken,
		testGetStringSourceForToken,
		testGetTextPositionFromElement,
		testHighlightLogoSyntaxInCodeElement,
		testHighlightLogoSyntaxInTextarea,
		testHighlighters,
		testProcessorsDirectory,
		testSelectiveHTMLSetter,
		testSimulatedEditing,
		testTextareaContextMenu,
		testTokenHTMLProcessors
	], logger);
};