export function createTestG() {
	const svg = document.createElement('div');
	svg.innerHTML = '<svg><g></g></svg>';
	const g = svg.querySelector('g');
	return g;
};