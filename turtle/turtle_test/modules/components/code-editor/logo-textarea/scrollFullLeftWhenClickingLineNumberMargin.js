export function scrollFullLeftWhenClickingLineNumberMargin(lineNumbers) {
	const scrollableElement = lineNumbers.lineNumbersContainer.closest('.scrollable-logo-code');
	lineNumbers.addEventListener('line-number-click', function() {
		scrollableElement.scrollLeft = 0;
	});
};