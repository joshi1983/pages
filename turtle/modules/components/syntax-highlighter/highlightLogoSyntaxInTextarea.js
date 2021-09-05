import { charIndexToParseTreeTokenPosition } from '../../parsing/charIndexToParseTreeTokenPosition.js';
import { ClipboardHelper } from '../../ClipboardHelper.js';
import { codeToElement } from './codeToElement.js';
import { codeToHTML } from './codeToHTML.js';
import { Highlighter } from './highlighters/Highlighter.js';
import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { RateLimiter } from '../../RateLimiter.js';
import { textareaContextMenu } from './textareaContextMenu.js';

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
		const textareaBox = textarea.getBoundingClientRect();
		textarea.style.minWidth = Math.ceil(preBox.width) + 'px';
	}

	function refreshPre() {
		const newValue = textarea.value;
		if (newValue !== latestValue) {
			const htmlInfo = codeToHTML(newValue, undefined, undefined, id);
			if (htmlInfo === undefined)
				pre.innerText = newValue;
			else {
				pre.innerHTML = htmlInfo.html;
				Highlighter.process(pre);
				tree = htmlInfo.tree;
				allTokens = ParseTreeToken.flatten(tree);
			}
			latestValue = newValue;
			refreshTextareaWidth();
		}
	}
	function refreshPreTimeout() {
		RateLimiter.run(id, refreshPre, 50); // give it time for the textarea's value to change.
	}
	['change', 'cut', 'keyup', 'paste', 'propertychange'].forEach(function(key) {
		textarea.addEventListener(key, refreshPreTimeout);
	});
	function updateBracketHighlighting() {
		let pos = ClipboardHelper.getCursorPosition(textarea);
		let spans = pre.querySelectorAll(`span[id^="${id}-"].highlighted`);
		spans.forEach(s => s.classList.remove('highlighted'));
		if (tree !== undefined && pos !== undefined && pos !== 0) {
			pos--;
			const s = textarea.value;
			const ch = s.charAt(pos);
			if ('()[]'.indexOf(ch) !== -1) {
				if (pos !== undefined) {
					pos = charIndexToParseTreeTokenPosition(pos, textarea.value);
					const nearToken = allTokens.filter(t => t.val === ch && t.lineIndex === pos.lineIndex && t.colIndex === pos.colIndex)[0];
					if (nearToken !== undefined) {
						const otherToken = nearToken.parentNode.children.filter(ct => ct.isBracket() && ct !== nearToken)[0];
						if (otherToken !== undefined) {
							const span1 = document.getElementById(`${id}-${pos.lineIndex}-${pos.colIndex}`);
							const span2 = document.getElementById(`${id}-${otherToken.lineIndex}-${otherToken.colIndex}`);
							if (span1 !== null)
								span1.classList.add('highlighted');
							if (span2 !== null)
								span2.classList.add('highlighted');
						}
					}
				}
			}
		}
	}
	['keyup', 'blur', 'focus', 'mouseup', 'click'].forEach(function(key) {
		textarea.addEventListener(key, function() {
			// use timeout to let the event's effects complete before calling updateBracketHighlighting.
			setTimeout(updateBracketHighlighting, 0);
		});
	});

	const context2 = Object.assign({
		'textarea': textarea
	}, context);
	textarea.addEventListener('contextmenu', textareaContextMenu(context2));
};