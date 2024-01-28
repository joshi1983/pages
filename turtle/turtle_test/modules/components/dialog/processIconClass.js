export function processIconClass(dialogTitle, dialogElement, iconClass) {
	if (typeof iconClass === 'string') {
		const windowTitleBar = dialogElement.querySelector('.window-title-bar');
		const icon = document.createElement('span');
		icon.innerHTML = `<span class="${iconClass}"></span>`;
		windowTitleBar.insertBefore(icon, dialogTitle);
	}
};