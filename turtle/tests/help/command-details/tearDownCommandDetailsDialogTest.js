export function tearDownCommandDetailsDialogTest() {
	const ids = ['command-inputs', 'no-command-output', 'no-command-inputs', 'command-output-types', 'command-inputs-extra'];
	ids.forEach(function(id) {
		document.getElementById(id).remove();
	});
};