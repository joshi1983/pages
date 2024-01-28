import { messageToDiv } from './messageToDiv.js';
import { MessageTypes } from './MessageTypes.js';
import { processHelpLinks } from '../help/processHelpLinks.js';

class PrivateToastMessages {
	constructor() {
		this.container = document.getElementById('toast-message-container');
		this.commandBox = document.getElementById('command-box');
	}

	_updateTop() {
		var newHeight = 0;
		const divs = this.container.querySelectorAll(':scope > div');
		divs.forEach(function(div) {
			newHeight += div.offsetHeight;
		});
		newHeight += 2;
		const rect = this.commandBox.getBoundingClientRect();
		
		// if there isn't enough space above the command box,
		// show the messages below the top of the command box.
		if (rect.top < newHeight) {
			this.container.style.top = 0;
		}
		else {
			this.container.style.top = '-' + newHeight + 'px';
		}
	}

	_message(div) {
		this.container.appendChild(div);
		processHelpLinks(div);
		const outer = this;
		const hidingInterval = 1000;

		setTimeout(function() {
			div.classList.add('hiding');
			setTimeout(function() {
				div.remove();
				outer._updateTop();
			}, hidingInterval);
		}, 2500);
		outer._updateTop();
	}

	_createDiv(msg, type, isHTML) {
		if (typeof isHTML !== 'boolean')
			throw new Error('_createDiv requires isHTML to be boolean');
		if (typeof type !== 'number')
			throw new Error('type must be a number');

		return messageToDiv(msg, type, isHTML);
	}

	error(msg, isHTML) {
		this._message(this._createDiv(msg, MessageTypes.TypeError, isHTML));
	}

	success(msg, isHTML) {
		this._message(this._createDiv(msg, MessageTypes.TypeSuccess, isHTML));
	}

	warn(msg, isHTML) {
		this._message(this._createDiv(msg, MessageTypes.TypeWarning, isHTML));
	}
}

const ToastMessages = new PrivateToastMessages();
export { ToastMessages };