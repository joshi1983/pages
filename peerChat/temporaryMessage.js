var temporaryMessageTimer;

function showTemporaryMessage(msg, id) {
	if (id === undefined)
		id = 'temporary-message';
	if (temporaryMessageTimer !== undefined)
		clearTimeout(temporaryMessageTimer);
	var messageElement = document.getElementById(id);
	messageElement.classList.remove('hidden');
	messageElement.innerText = msg;
	temporaryMessageTimer = setTimeout(function() {
		messageElement.classList.add('hidden');
		temporaryMessageTimer = undefined;
	}, 3000);
}
