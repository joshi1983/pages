import { addFooterButton } from '../../../modules/components/dialog/addFooterButton.js';

function createMockDialog() {
	const dialog = document.createElement('div');
	dialog.classList.add('dialog');
	const footer = document.createElement('footer');
	footer.classList.add('dialog-footer');
	dialog.appendChild(footer);
	document.body.appendChild(dialog);
}

function tearDownMockDialog() {
	const dialog = document.querySelector('body .dialog');
	dialog.remove();
}

export function testAddFooterButton(logger) {
	createMockDialog();
	let clicked = false;
	const footerElement = document.querySelector('.dialog footer.dialog-footer');
	addFooterButton({
		'caption': 'Hello', 
		'click': function() {
			clicked = true;
		}
	}, footerElement);
	const button = document.querySelector('.dialog footer.dialog-footer button:last-child');
	button.click();
	if (clicked !== true)
		logger('button expected to be clicked but clicked=' + clicked);
	tearDownMockDialog();
};