export function hasAncestor(ancestor, descendent) {
	while (descendent !== null) {
		if (ancestor === descendent)
			return true;
		descendent = descendent.parentNode;
	}
	return false;
};