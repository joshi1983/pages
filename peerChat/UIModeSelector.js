class UIModeSelector {
	constructor(modes) {
		this.modes = modes;
		var outer = this;
		modes.forEach(function(mode) {
			mode.setUIModeSelector(outer);
		});
	}

	setActive(mode) {
		this.modes.forEach(function(_mode) {
			if (_mode !== mode) {
				_mode.close();
			}
		});
		mode.show(false);
	}
}