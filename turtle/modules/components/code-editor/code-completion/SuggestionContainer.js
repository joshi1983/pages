function getRelativeRight(containerBox, child) {
	const childBox = child.getBoundingClientRect();
	return childBox.right - containerBox.left;
}

function getRelativeLeft(containerBox, child) {
	const childBox = child.getBoundingClientRect();
	return childBox.left - containerBox.left;
}

export class SuggestionContainer {
	constructor() {
		this.containerDiv = document.createElement('div');
		this.containerDiv.classList.add('suggestions');
	}

	disposeClickableNames() {
		if (this.clickableNames !== undefined) {
			for (const cName of this.clickableNames) {
				cName.dispose();
			}
		}
		this.clickableNames = undefined;
		this.containerDiv.innerText = '';
	}

	dispose() {
		this.disposeClickableNames();
		this.containerDiv.innerText = '';
		this.containerDiv = undefined;
	}

	getCursorXOffset() {
		if (this.containerDiv !== 0) {
			const child = this.containerDiv.querySelector(':scope > div');
			if (child !== null) {
				const containerBox = this.containerDiv.getBoundingClientRect();
				const typed = child.querySelector('.typed');
				const untyped = child.querySelector('.untyped');
				if (typed !== null)
					return getRelativeRight(containerBox, typed);
				if (untyped !== null)
					return getRelativeLeft(containerBox, untyped);
			}
		}
		return 0;
	}

	hide() {
		this.disposeClickableNames();
		this.containerDiv.innerText = '';
		if (this.containerDiv.parentElement !== null) {
			document.body.removeChild(this.containerDiv);
		}
	}

	setPosition(position) {
		const style = this.containerDiv.style;
		style.bottom = '';
		style.top = '';
		if (position.anchoringProperty === 'bottom') {
			style.bottom = Math.round(position.bottom) + 'px';
		}
		else {
			style.top = Math.round(position.top) + 'px';
		}
		style.left = Math.round(position.cursorX - this.getCursorXOffset()) + 'px';
		style.maxHeight = Math.round(position.bottom - position.top) + 'px';
	}

	setSuggestions(clickableNames) {
		this.disposeClickableNames();
		this.clickableNames = clickableNames;
		const outer = this;
		clickableNames.forEach(function(clickableName) {
			outer.containerDiv.appendChild(clickableName.getDiv());
		});
		if (clickableNames.length === 0)
			this.hide();
		else
			this.show();
	}

	show() {
		if (this.containerDiv.parentElement === null)
			document.body.appendChild(this.containerDiv);
	}
};