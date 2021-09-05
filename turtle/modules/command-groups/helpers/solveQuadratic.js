export function solveQuadratic(a, b, c) {
	if (a === 0) {
		if (b === 0) {
			if (c === 0)
				// The equation simplifies to: 0 = 0.
				return [0];// infinite solutions actually but let's give just 1.
			else
				return []; // some constant other than 0 = 0 so no solution.
		}
		// Solve bx + c = 0.
		// bx = -c
		// x = -c / b.
		return [-c / b];
	}
	let discriminant = b * b - 4 * a * c;
	if (discriminant < 0)
		return [];
	else if (discriminant === 0) {
		return [-b / (a + a)];
	}
	else {
		a += a; // same as a = a * 2.
		discriminant = Math.sqrt(discriminant);
		return [(-b - discriminant) / a, (-b + discriminant) / a];
	}
};
