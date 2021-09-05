class PrivateKeys {
	checkKey(event, lowerCaseKey, code) {
		if (!event)
			event = window.event;
		if (typeof event.code === 'string')
			return event.code.toLowerCase() === lowerCaseKey;
		else if (typeof event.key === 'string')
			return event.key.toLowerCase() === lowerCaseKey;
		else if (event.keyCode !== undefined) // deprecated
			return event.keyCode === code;
		else if (event.which !== undefined) // not standard but better than nothing.
			return event.which === code;
	}

	isDownArrow(event, includingNumPad) {
		if (includingNumPad === undefined)
			includingNumPad = true;
		if (includingNumPad && this.checkKey(event, 'numpad2', 38))
			return true;
		return this.checkKey(event, 'arrowdown', 40);
	}

	isEnterKey(event) {
		return this.checkKey(event, 'enter', 13);
	}

	isSemicolon(event) {
		return this.checkKey(event, 'semicolon', 186);
	}

	isTabKey(event) {
		return this.checkKey(event, 'tab', 9);
	}

	isUpArrow(event, includingNumPad) {
		if (includingNumPad === undefined)
			includingNumPad = true;
		if (includingNumPad && this.checkKey(event, 'numpad8', 38))
			return true;
		return this.checkKey(event, 'arrowup', 38);
	}

}

const Keys = new PrivateKeys();

export { Keys };