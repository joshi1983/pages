const classesToRemoveIDs = ['binary-operator', 'boolean-literal', 'comment', 
'keyword', 'number-literal', 'parameterized-group',
'procedure-name', 'procedure-parameter',
'string-literal', 'unary-operator'];

export function simplifyHTML(html) {
	const e = document.createElement('div');
	e.innerHTML = html;
	e.querySelectorAll('[id]').forEach(function(child) {
		classesToRemoveIDs.forEach(function(classToRemoveID) {
			if (child.classList.contains(classToRemoveID))
				child.removeAttribute('id');
		});
	});
	return e.innerHTML;
};