export function sphere(token, result, settings) {
	let radius = 100;
	// FIXME: determine things like radius and color from token.children.
	result.append(`sphere ${radius}`);
};