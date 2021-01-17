document.addEventListener('DOMContentLoaded', function() {
	var settings = document.getElementById('settings');
	
	function removeDialog() {
		var dialog = document.getElementById('dialog');
		dialog.remove();
		settings.removeEventListener('mousedown', removeDialog);
		settings.removeEventListener('touchstart', removeDialog);
	}
	
	document.getElementById('dialog-ok').addEventListener('click', removeDialog);
	settings.addEventListener('mousedown', removeDialog);
	settings.addEventListener('touchstart', removeDialog);
});