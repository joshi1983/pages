export function mightBeLabelName(s) {
	return /^[a-z_][a-z_\d]*$/i.test(s);
};