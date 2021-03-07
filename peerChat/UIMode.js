class UIMode {
	constructor(e) {
		this.e = e;
	}

	isOpen() {
		return !this.e.classList.contains('closed');
	}

	show(updateUIModeSelector) {
		this.e.classList.remove('closed');
		if (updateUIModeSelector !== false)
			this.uiModeSelector.setActive(this);
	}

	close() {
		this.e.classList.add('closed');
	}

	setUIModeSelector(uiModeSelector) {
		this.uiModeSelector = uiModeSelector;
	}
}