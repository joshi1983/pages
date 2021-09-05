const pattern = /^[1-9][0-9]*$/;

export function isBase10IntegerLiteral(s) {
	return pattern.test(s);
};