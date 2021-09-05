import { codeToElement } from './codeToElement.js';
import { codeToHTML } from './codeToHTML.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { processCodeEditorPasteEvent } from './processCodeEditorPasteEvent.js';
import { RateLimiter } from '../../RateLimiter.js';
import { SelectiveHTMLSetter } from './SelectiveHTMLSetter.js';
import { StringUtils } from '../../StringUtils.js';
import { textareaContextMenu } from './textareaContextMenu.js';
import { updateBracketHighlighting } from './highlighters/updateBracketHighlighting.js';

const preHTMLSetterMap = new Map();
export { preHTMLSetterMap }; // for unit testing purposes only

var syntaxhighlighterCount = 0;
export function highlightLogoSyntaxInTextarea(textarea, context) {
	if (!(textarea instanceof Element))
		throw new Error('textarea must be an Element');
	if (textarea.parentNode === null)
		throw new Error('textarea must have a parentNode');
	const id = `textarea-syntax-highlighter-${++syntaxhighlighterCount}`;
	const preInfo = codeToElement(textarea.value, undefined, undefined, id);
	const pre = preInfo.element;
	let tree = preInfo.tree;
	let allTokens = ParseTreeToken.flatten(tree);
	const div = document.createElement('div');
	const parent = textarea.parentNode;
	pre.setAttribute('aria-hidden', 'true');
	div.classList.add('syntax-highlighter', 'textarea-container');
	textarea.setAttribute('wrap', 'off');
	/* 
		important for very long comments since Logo supports only single-line comments. 
		A wrapped single-line comment looks like an error because English appears to be on lines that are not comments.
	*/

	div.appendChild(pre);
	parent.replaceChild(div, textarea);
	div.appendChild(textarea);
	var latestValue = textarea.value + ' ';

	function refreshTextareaWidth() {
		const preBox = pre.getBoundingClientRect();
		textarea.style.minWidth = Math.ceil(preBox.width) + 'px';
	}

	function refreshPre() {
		const newValue = textarea.value;
		if (newValue !== latestValue) {
			const htmlInfo = codeToHTML(newValue, undefined, undefined, id);
			let setter = preHTMLSetterMap.get(pre);
			if (setter === undefined) {
				setter = new SelectiveHTMLSetter(pre);
				preHTMLSetterMap.set(pre, setter);
			}
			if (htmlInfo === undefined) {
				setter.setHTMLLines(StringUtils.escapeHTML(newValue).split('\n'));
			}
			else {
				setter.setHTMLLines(htmlInfo.html.split('\n'));
				tree = htmlInfo.tree;
				allTokens = ParseTreeToken.flatten(tree);
			}
			latestValue = newValue;
			refreshTextareaWidth();
		}
	}
	function refreshPreTimeout(e) {
		processCodeEditorPasteEvent(e);
		RateLimiter.run(id, refreshPre, 50); // give it time for the textarea's value to change.
	}
	/*
	The variety of events corresponds with the variety of ways the textarea.value can be changed.
	Selecting and dragging text around with the mouse cursor requires the "drop" event because none 
	of the other listed event keys are triggered by it.
	*/
	['change', 'cut', 'drop', 'keyup', 'paste', 'propertychange'].forEach(function(key) {
		textarea.addEventListener(key, refreshPreTimeout);
	});
	['keyup', 'blur', 'focus', 'mouseup', 'click'].forEach(function(key) {
		textarea.addEventListener(key, function() {
			// use timeout to let the event's effects complete before calling updateBracketHighlighting.
			setTimeout(updateBracketHighlighting(pre, textarea, id, () => tree, () => allTokens), 0);
		});
	});

	const context2 = Object.assign({
		'convertToAsset': context.convertToAsset,
		'textarea': textarea,
		'getTree': function() {
			const parseLogger = new ParseLogger();
			const proceduresMap = new Map();
			return LogoParser.getParseTree(textarea.value, parseLogger, proceduresMap);
		},
		'ToastMessages': context.ToastMessages
	}, context);
	textarea.addEventListener('contextmenu', textareaContextMenu(context2));
};