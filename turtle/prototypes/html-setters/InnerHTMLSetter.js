export class InnerHTMLSetter {
	constructor(container) {
		this.container = container;
	}

	setHTMLLines(htmlLines) {
		this.container.innerHTML = '<div>' + htmlLines.join('</div><div>') + '</div>';
	}
};