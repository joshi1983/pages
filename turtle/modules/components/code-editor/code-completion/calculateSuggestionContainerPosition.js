/*
Code in this project does related calculations:
https://github.com/component/textarea-caret-position

*/
function getCoordinatesRelativeToTextarea(textarea, position) {
	const lines = textarea.value.split('\n');
	let positionIndex = position.lineIndex;
	for (let i = 0; i < position.lineIndex; i++) {
		positionIndex += lines[i].length;
	}
	positionIndex += position.colIndex;
	const pixelCoordinatesResult = window.getCaretCoordinates(textarea, positionIndex);
	position.cursorX = 0;
	if (typeof pixelCoordinatesResult === 'object' && Number.isInteger(pixelCoordinatesResult.left))
		position.cursorX = pixelCoordinatesResult.left;
	return pixelCoordinatesResult;
}

export function calculateSuggestionContainerPosition(textarea, position) {
	const info = getCoordinatesRelativeToTextarea(textarea, position);
	const lineHeight = info.height;
	const box = textarea.getBoundingClientRect();
	const textareaMiddleY = (box.top + box.bottom) / 2;
	const lineTop = box.top + info.top;
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
	position.cursorX += box.left;
	console.log(`cursorX=${position.cursorX}`);
};