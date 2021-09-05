function createHeadingLine(parseTreeToken, ParseTreeTokenType) {
	const result = document.createElement('div');
	result.classList.add('parse-tree-token-heading');
	const notch = document.createElement('span');
	notch.classList.add('notch' + (parseTreeToken.children.length === 0 ? 2 : 1));
	result.appendChild(notch);
	const bulletElement = parseTreeToken.children.length === 0 ? undefined : document.createElement('span');
	if (bulletElement !== undefined) {
		bulletElement.classList.add('fa', 'fa-angle-right');
		result.appendChild(bulletElement);
	}
	const valSpan = document.createElement('span');
	valSpan.classList.add('val');
	valSpan.innerText = '' + parseTreeToken.val;
	result.appendChild(valSpan);
	const typeSpan = document.createElement('span');
	typeSpan.innerText = ParseTreeTokenType.getNameFor(parseTreeToken.type);
	typeSpan.classList.add('type');
	result.appendChild(typeSpan);
	const positionSpan = document.createElement('span');
	positionSpan.classList.add('coordinates');
	positionSpan.innerText = parseTreeToken.colIndex + ', ' + parseTreeToken.lineIndex;
	result.appendChild(positionSpan);
	return {
		'bullet': bulletElement,
		'headline': result
	};
}

export function parseTreeTokenToElement(parseTreeToken, ParseTreeTokenType) {
	if (typeof parseTreeToken === 'object') {
		if (parseTreeToken.constructor.name !== 'ParseTreeToken')
			throw new Error(`parseTreeToken must be a ParseTreeToken. name=${parseTreeToken.constructor.name}`);
	}
	else
		throw new Error(`parseTreeToken must be an object. parseTreeToken=${parseTreeToken}`);
	const result = document.createElement('div');
	const headingLineInfo = createHeadingLine(parseTreeToken, ParseTreeTokenType);
	result.appendChild(headingLineInfo.headline);
	if (parseTreeToken.children.length !== 0) {
		headingLineInfo.headline.classList.add('clickable');
		headingLineInfo.headline.addEventListener('click', function() {
			result.classList.toggle('collapsed');
			const b = headingLineInfo.bullet;
			if (b !== undefined) {
				b.classList.toggle('fa-angle-down');
				b.classList.toggle('fa-angle-right');
			}
		});
		const childList = document.createElement('div');
		childList.classList.add('child-list');
		parseTreeToken.children.forEach(function(childToken) {
			childList.appendChild(parseTreeTokenToElement(childToken, ParseTreeTokenType));
		});
		result.appendChild(childList);
	}
	return result;
};