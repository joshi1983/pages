import { bindCancelClick } from './dialog/bindCancelClick.js';
import { bindMaximizeClick } from './dialog/bindMaximizeClick.js';
import { bindOkClick } from './dialog/bindOkClick.js';
import { DialogGroupRepository } from './dialog/DialogGroupRepository.js';
import { DialogStates } from './dialog/DialogStates.js';
import { fetchText } from '../fetchText.js';
import { isNumber } from '../isNumber.js';
import { processDialogGroupIcon } from './dialog/processDialogGroupIcon.js';
import { processFooterVisibility } from './dialog/processFooterVisibility.js';
import { processHelpButton } from './dialog/processHelpButton.js';
import { processHelpLinks } from '../help/processHelpLinks.js';
import { processIconClass } from './dialog/processIconClass.js';
import { processRestoreSize } from './dialog/processRestoreSize.js';
import { ToastMessages } from './ToastMessages.js';
const dialogHTMLTemplate = await fetchText('content/components/dialog.html');

class PrivateDialog {
	constructor() {
		this.backdrop = document.createElement('div');
		this.backdrop.classList.add('dialog-backdrop');
		this.dialog = document.createElement('div');
		this.dialog.classList.add('dialog');
		const outer = this;
		this.backdrop.addEventListener('click', function() {
			if (outer.isCancelingOnClickOut)
				outer.hide();
			else
				ToastMessages.warn('You must click a button from the bottom of the dialog to change focus.', false);
		});
	}

	hide() {
		if (typeof this.resolve === 'function') {
			this.resolve();
			this.resolve = undefined;
		}
		this.backdrop.remove();
		this.dialog.remove();
		// Undo any changes to classes that may have been done while showing.
		this.dialog.className = "dialog";
	}

	isMaximized() {
		return this.dialog.classList.contains('maximized');
	}

	isVisible() {
		const backdrop = document.querySelector('body > .dialog-backdrop');
		if (backdrop !== null)
			return true;
		return false;
	}

	show(html, title, width, height, options) {
		if (typeof title !== 'string')
			throw new Error('Title must be a string');
		if (options === undefined)
			options = {};
		else if (typeof options !== 'object')
			throw new Error('options can only be undefined or an object.  Not: ' + options);

		this.isCancelingOnClickOut = options.isCancelingOnClickOut !== false;
		// if the cancelClicked callback is defined, the caller definitely wants the cancel button to show.
		if (typeof options.cancelClicked === 'function')
			options.showCancel = true;

		let state = DialogStates.RESTORED;
		if (options.groupId !== undefined) {
			state = DialogGroupRepository.getState(options.groupId);
			const dimensions = DialogGroupRepository.getRestoredDimensions(options.groupId);
			width = dimensions.width;
			height = dimensions.height;
		}
		if (!isNumber(width) || !isNumber(height))
			throw new Error('show requires width and height to be numbers.  width specified as ' + width + ', and height specified as ' + height);
		if (this.resolve !== undefined) // if the dialog is already showing
			this.resolve(); // indicate that dialog is being deactivated.

		const body = document.body;
		if (this.backdrop.parentNode !== body)
			body.appendChild(this.backdrop);

		const substitutedHTML = dialogHTMLTemplate.replace('$$$DIALOG-CONTENT-HTML$$$', html);
		this.dialog.innerHTML = substitutedHTML;
		const outer = this;
		let showCancelButton = false;
		this.dialog.classList = 'dialog';
		if (typeof options.className === 'string')
			this.dialog.classList.add(options.className);
		if (options.showCancel)
			showCancelButton = true;
		if (this.dialog.parentNode !== body)
			body.appendChild(this.dialog);
		const dialogTitle = this.dialog.querySelector('#dialog-title');
		const cancelButton = document.getElementById('dialog-footer-cancel');
		const cancelButtonStyle = cancelButton.style;
		cancelButtonStyle.display = showCancelButton ? 'inline-block' : 'none';
		dialogTitle.innerText = title;
		const okButton = document.getElementById('dialog-footer-ok');
		const closeElement = document.getElementById('dialog-close');
		const maximizeElement = document.getElementById('dialog-maximize');
		const restoreElement = document.getElementById('dialog-restore');
		function handleResized() {
			if (typeof options.onResize === 'function')
				options.onResize();
		}
		processRestoreSize(options, width, height, this.dialog, maximizeElement, restoreElement, handleResized);
		processIconClass(dialogTitle, this.dialog, options.iconClass);
		processDialogGroupIcon(options.groupId, options.showGroupIcon);
		processHelpButton(options.helpID);
		processFooterVisibility(this.dialog, options);
		if (typeof options.okCaption !== 'string')
			okButton.innerText = 'OK';
		else
			okButton.innerText = options.okCaption;
		if (typeof options.cancelCaption === 'string')
			cancelButton.innerText = options.cancelCaption;
		bindMaximizeClick(this.dialog, restoreElement, maximizeElement, options.groupId, options.disableResize, handleResized, state);
		closeElement.addEventListener('click', function() {
			outer.hide();
		});
		bindOkClick(okButton, options, this);
		bindCancelClick(cancelButton, options, this);
		processHelpLinks(this.dialog);
		return new Promise(function(resolve, reject) {
			outer.resolve = resolve;
		});
	}
}

const Dialog = new PrivateDialog();

export { Dialog };