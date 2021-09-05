import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCodeToElement } from './testCodeToElement.js';
import { testCodeToHTML } from './testCodeToHTML.js';
import { testEscapeSpecialCharacters } from './testEscapeSpecialCharacters.js';
import { testGetCSSClassNameForParseToken } from './testGetCSSClassNameForParseToken.js';
import { testGetStringSourceForToken } from './testGetStringSourceForToken.js';
import { testGetURLMatches } from './testGetURLMatches.js';
import { testHighlightLogoSyntaxInCodeElement } from './testHighlightLogoSyntaxInCodeElement.js';
import { testHighlightLogoSyntaxInTextarea } from './testHighlightLogoSyntaxInTextarea.js';

export function testSyntaxHighlighter(logger) {
	testCodeToElement(prefixWrapper('testCodeToElement', logger));
	testCodeToHTML(prefixWrapper('testCodeToHTML', logger));
	testEscapeSpecialCharacters(prefixWrapper('testEscapeSpecialCharacters', logger));
	testGetCSSClassNameForParseToken(prefixWrapper('testGetCSSClassNameForParseToken', logger));
	testGetStringSourceForToken(prefixWrapper('testgetStringSourceForToken', logger));
	testGetURLMatches(prefixWrapper('testGetURLMatches', logger));
	testHighlightLogoSyntaxInCodeElement(prefixWrapper('testHighlightLogoSyntaxInCodeElement', logger));
	testHighlightLogoSyntaxInTextarea(prefixWrapper('testHighlightLogoSyntaxInTextarea', logger));
};