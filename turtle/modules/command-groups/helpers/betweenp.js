export function betweenp(num1, boundary1, boundary2) {
	if (boundary1 < boundary2) {
		return num1 > boundary1 && num1 < boundary2;
	}
	else {
		return num1 > boundary2 && num1 < boundary1;
	}
};