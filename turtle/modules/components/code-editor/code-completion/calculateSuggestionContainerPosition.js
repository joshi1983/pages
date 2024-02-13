/*
Code in this project does related calculations:
https://github.com/component/textarea-caret-position

*/

export function calculateSuggestionContainerPosition(textarea, position) {
	const style = window.getComputedStyle(textarea);
	let lineHeight = style.lineHeight;
	if (typeof lineHeight === 'string') {
		lineHeight = lineHeight.trim();
		if (lineHeight.endsWith('px'))
			lineHeight = lineHeight.substring(0, lineHeight.length - 2);
		if (lineHeight.endsWith('em')) {
			lineHeight = lineHeight.substring(0, lineHeight.length - 2);
			if (isNaN(lineHeight))
				lineHeight = 13;
			else
				lineHeight = parseFloat(lineHeight) * 13; // assuming 13 is what 1em would represent.
		}
		if (lineHeight === 'normal')
			lineHeight = 13;
	}
	lineHeight = parseFloat(lineHeight);
	const box = textarea.getBoundingClientRect();
	const textareaMiddleY = (box.top + box.bottom) / 2;
	const lineTop = box.top + lineHeight * position.lineIndex;
	const lineBottom = lineTop + lineHeight;
	const lineMiddleY = (lineTop + lineBottom) / 2;
	if (lineMiddleY > textareaMiddleY) {
		position.bottom = lineTop;
		position.top = box.top;
		position.anchoringProperty = 'bottom';
	}
	else {
		position.bottom = box.bottom;
		position.top = lineBottom;
		position.anchoringProperty = 'top';
	}
	console.log(textarea.getSelection().getRangeAt(0).getBoundingClientRect());
};