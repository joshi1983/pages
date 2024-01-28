import { compareParseTokens } from '../../../parsing/parse-tree-analysis/compareParseTokens.js';

function getInnerText(node) {
	if (node instanceof Element) {
		return node.innerText;
	}
	else if (node.nodeType === Node.TEXT_NODE)
		return node.nodeValue;
}

export function processText(text, location) {
	const lines = text.split('\n');
	const lineCount = lines.length - 1;
	let colIndex = location.colIndex;
	if (lineCount === 0) {
		colIndex += text.length;
	}
	else {
		colIndex = lines[lines.length - 1].length;
	}
	return {
		'lineIndex': location.lineIndex + lineCount,
		'colIndex': colIndex
	};
};

export function addLocationOffset(fromLocation, amountLocation) {
	let colIndex;
	if (amountLocation.lineIndex === 0)
		colIndex = fromLocation.colIndex - amountLocation.colIndex;
	else
		colIndex = fromLocation.colIndex;
	return {
		'lineIndex': fromLocation.lineIndex - amountLocation.lineIndex,
		'colIndex': colIndex
	};
};

export function findSpanAtLocation(container, location) {
	let child;
	if (container.nodeType === Node.TEXT_NODE)
		return container.parentNode;
	if (container.firstChild === null) {
		return container;
	}
	let tempLocation = {'colIndex': 0, 'lineIndex': 0};
	for (child = container.firstChild; child !== null; child = child.nextSibling) {
		let innerText = getInnerText(child);
		if (innerText !== undefined && innerText !== '' || child.tagName === 'DIV') {
			let newLocation;
			if (child.tagName === 'DIV') {
				newLocation = {
					'lineIndex': tempLocation.lineIndex + 1,
					'colIndex': 0
				};
			}
			else
				newLocation = processText(innerText, tempLocation);
			if (compareParseTokens(newLocation, location) > 0) {
				return findSpanAtLocation(child, addLocationOffset(location, tempLocation));
			}
			tempLocation = newLocation;
		}
	}
	return container;
};