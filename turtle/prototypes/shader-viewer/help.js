function hideHelp() {
	document.body.classList.remove('show-help');
}

function showHelp() {
	document.body.classList.add('show-help');
}

export function help() {
	const helpItem = document.getElementById('help');
	const closeButton = document.getElementById('close-help');
	const modalBackground = document.getElementById('modal-background');
	closeButton.addEventListener('click', hideHelp);
	modalBackground.addEventListener('click', hideHelp);
	helpItem.addEventListener('click', showHelp);
};