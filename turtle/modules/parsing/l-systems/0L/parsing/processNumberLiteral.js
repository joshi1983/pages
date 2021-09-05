export function processNumberLiteral(prev, next) {
	prev.appendChild(next);
	return prev;
};