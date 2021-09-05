export function appendChildren(parent, children) {
	children.forEach(function(newChild) {
		parent.appendChild(newChild);
	});
};