function getKeywordsContainer(div) {
	return div.querySelector('.keywords');
}

function isLastKeywordOnDifferentLineThanFirst(keywordsContainer) {
	const spans = keywordsContainer.querySelectorAll('span');
	const firstSpan = spans[0];
	const lastSpan = spans[spans.length - 1];
	return firstSpan.offsetTop !== lastSpan.offsetTop;
}

function tooFewKeywordsToWrap(keywordsContainer) {
	const spans = keywordsContainer.querySelectorAll('span');
	return spans.length <= 1;
}

function needsCompactKeywords(div) {
	const keywordsContainer = getKeywordsContainer(div);
	if (keywordsContainer === null)
		return false;
	if (tooFewKeywordsToWrap(keywordsContainer))
		return false;
	if (isLastKeywordOnDifferentLineThanFirst(keywordsContainer))
		return true;
	if (!keywordsContainer.classList.contains('compact'))
		return false;
}

function setKeywordsCompact(div, isCompact) {
	const keywordsContainer = getKeywordsContainer(div);
	if (keywordsContainer === null) {
		console.log(`keywords element not found in div`);
		return;
	}
	if (isCompact)
		keywordsContainer.classList.add('compact');
	else
		keywordsContainer.classList.remove('compact');
}

function isConnectedToBody(n) {
	while (n !== null) {
		if (n === document.body)
			return true;
		n = n.parentNode;
	}
	return false;
}

/*
We want the 'compact' class added to the keywords container if and only if spans will otherwise wrap to more than 1 line.
The goal is to shrink text just enough to prevent wrapping to more than one line.
We don't want to shrink more than necessary because larger text is easier to read.
*/
export function handleCompactKeywords(div, isFinalTry) {
	if (!(div instanceof Element))
		return;
	if (!isConnectedToBody(div))
		return;
	if (!div.classList.contains('clickable'))
		div = div.closest('.clickable');
	const needsCompact = needsCompactKeywords(div);
	if (needsCompact === true)
		setKeywordsCompact(div, needsCompactKeywords(div));
	else if (needsCompact === undefined) {
		if (isFinalTry === true)
			return; // give up.  Avoid endless recursion.
		setKeywordsCompact(div, false);
		setTimeout(function() {
			handleCompactKeywords(div, true);
		}, 0);
	}
	else
		setKeywordsCompact(div, false);
};