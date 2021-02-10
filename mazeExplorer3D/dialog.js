document.addEventListener('DOMContentLoaded', function() {
	var body = document.querySelector('body');
	var dialog = document.getElementById('dialog');
	var ok = document.getElementById('dialog-ok');
	var dialogBackdrop = document.getElementById('dialog-backdrop');

	function hideDialog() {
		dialog.remove();
		dialogBackdrop.remove();
	}

	ok.addEventListener('click', hideDialog);
	dialogBackdrop.addEventListener('mousedown', hideDialog);
	dialogBackdrop.addEventListener('touchstart', hideDialog);
});
