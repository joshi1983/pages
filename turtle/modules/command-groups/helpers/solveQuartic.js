import { compareNumbersAscending } from '../../compareNumbersAscending.js';

/*
This is adapted from code at:
https://javascriptsource.com/quartic-equation-solver/
which was created by: Brian Kieffer | http://www.freewebs.com/brianjs/

Adaptations include:
- converted the original script into a JavaScript module.
- Made a function use parameters and return an Array instead of interact directly with the document.
- Removed all complex(numbers with virtual components) results.
- using Math.cbrt instead of Math.pow(..., z) where z = 1/3 to boost efficiency and clarity of code.
- using Math.hypot in calcMult to boost efficiency and clarity of the code.
- using "const" where appropriate.
- eliminating some redundant variable declarations.  The original used "var" for variables that were previously declared.
- Used if-else instead of odd-looking and inefficient "done" variables which had the sole purpose of preventing later if-statements from running.
- Used boolean values instead of 1 and 0 for clarity and efficiency.
- Used === and !== for extra efficiency.
- replacing indentation spaces with tabs to be consistent with the rest of WebLogo code base.
*/

function calcMult(a2, b2, c2, d2, e2) {
	var real = a2 * c2 - b2 * d2;
	var img = b2 * c2 + a2 * d2

	if (e2 === 0) {
		return real;
	} else {
		return img;
	}
}

function iSquareRoot(a1, b1, n1) {
	const y = Math.hypot(a1, b1);
	const y1 = Math.sqrt((y - a1) / 2);
	const x1 = b1 / (2*y1);

	if (n1 == 0) {
		return x1;
	} else {
		return y1;
	}
}

export function solveQuartic(aq, bq, cq, dq, eq) {
	const aq2 = aq; // Keeps Orignial AQ value
	const bq2 = bq; // Keeps Orignial BQ Value
	// Define Perfect Quartic Varible
	var perfect = false;
	var perfectBiquadratic = false;

	// The Bi-Quadratic 2 Perfect Squares that are negative test
	if (cq*cq - 4 * aq * eq === 0 && cq > 0) {
		perfectBiquadratic = true;
	}

	// Divide Equation by the X^4 Coefficent to make equation in the form of X^4 + AX^3 + BX^2 + CX + D
	bq /= aq;
	cq /= aq;
	dq /= aq;
	eq /= aq;
	aq = 1;
	const f2 = cq - (3 * bq * bq / 8);
	const g2 = dq + (bq * bq * bq/8) - (bq * cq/2);
	const h2 = eq - (3 * bq * bq * bq * bq / 256) + (bq * bq * (cq / 16)) - (bq * dq/4);
	var a = 1;
	var b = f2/2;
	var c = (f2*f2 - (4*h2)) / 16;
	var d = -1*((g2*g2)/64);

	if (b === 0 && c === 0 && d === 0) {
		perfect = true;
	}

	// Cubic routine starts here...
	var f = (((3 * c) / a) - ((b * b) / (a * a))) / 3;
	var g = (((2 * b * b * b) / (a * a * a)) - ((9 * b * c) / (a * a)) + ((27 * d) / a)) / 27;
	var h = ((g * g)/4) + (( f * f * f)/27);
	var xoneterm;
	var xtwoterm;
	var xthreeterm;
	var ipart = 0;
	var qipart;
	var p2ipart;
	var q = 0;
	var r = 0;
	var s = 0;
	var p2;

	if (h <= 0) {
		const i = Math.sqrt(((g*g) / 4) - h);
		const j = Math.cbrt(i);
		const k = Math.acos(-g / (2*i));
		const l = -1 * j;
		const m = Math.cos(k / 3);
		const n = Math.sqrt(3) * Math.sin(k / 3);
		const p = (b / (3*a)) * -1;
		xoneterm = (2*j) * Math.cos(k/3) - (b / (3*a));
		xtwoterm = l * (m + n) + p;
		xthreeterm = l * (m - n) + p;
	}

	if (h > 0) {
		const S = Math.cbrt(Math.sqrt(h) - g * 0.5);
		const U = Math.cbrt(-g / 2 - Math.sqrt(h));
		xoneterm = (S + U) - (b / (3 * a));
		xtwoterm = -(S + U)/2 - (b / (3 * a));
		ipart = ((S - U) * Math.sqrt(3)) / 2;
		xthreeterm = xtwoterm;
	}

	if (f === 0 && g === 0 && h === 0) {
		xoneterm = -Math.cbrt(d / a);
		xtwoterm = xoneterm;
		xthreeterm = xoneterm;
	}
	// ... and ends here.

	// Return to solving the Quartic.
	if (ipart === 0) {
		if (xoneterm === 0) {
			p2 = Math.sqrt(xtwoterm);
			q = Math.sqrt(xthreeterm);
			r = -g2 / (8 * p2 * q);
			s = bq2 / (4 * aq2);
		}
		else if (xtwoterm === 0) {
			p2 = Math.sqrt(xoneterm);
			q = Math.sqrt(xthreeterm);
			r = -g2 / (8 * p2 * q);
			s = bq2/(4 * aq2);
		}
		else if (xthreeterm === 0) {
			p2 = Math.sqrt(xoneterm);
			q = Math.sqrt(xtwoterm);
			r = -g2 / (8 * p2 * q);
			s = bq2 / (4 * aq2);
		}
		else {
			p2 = Math.sqrt(xoneterm);
			if (xthreeterm < 0) {
				q = Math.sqrt(xtwoterm);
				r = -g2 / (8 * p2 * q);
				s = bq2 / (4 * aq2);
			} else {
				q = Math.sqrt(xthreeterm);
				r = -g2 / (8 * p2 * q);
				s = bq2 / (4 * aq2);
			}
		}
	}

	let result;
	if (ipart !== 0) {
		p2 = iSquareRoot(xtwoterm, ipart, 0);
		p2ipart = iSquareRoot(xtwoterm, ipart, 1);
		q = iSquareRoot(xthreeterm, -ipart, 0);
		qipart = iSquareRoot(xthreeterm, -ipart, 1);
		const mult = calcMult(p2, p2ipart, q, qipart, 0);
		r = -g2 / (8 * mult);
		s = bq2 / (4 * aq2);
	}
	else {
		if (xtwoterm < 0 && xthreeterm < 0) {
			xtwoterm = -xtwoterm;
			xthreeterm = -xthreeterm;
			p2 = 0;
			q = 0;
			p2ipart = Math.sqrt(xtwoterm);
			qipart = Math.sqrt(xthreeterm);
			const mult = calcMult(p2, p2ipart, q, qipart, 0);
			r = -g2 / (8 * mult);
			s = bq2 / (4 * aq2);
			ipart = 1;
		}
		else if (xoneterm > 0 && xtwoterm < 0 && xthreeterm === 0) {
			xtwoterm = -xtwoterm;
			p2 = Math.sqrt(xoneterm);
			q = 0;
			p2ipart = 0;
			qipart = Math.sqrt(xtwoterm);
			const mult = calcMult(p2, p2ipart, q, qipart, 0);
			const mult2 = calcMult(p2, p2ipart, q, qipart, 1);
			r = -g2/(8 * mult);
			if (mult2 != 0) {
				r = 0;
			}
			s = bq2 / (4 * aq2);
			ipart = 1;
		}
		else if (xtwoterm === 0 && xthreeterm === 0) {
			p2 = Math.sqrt(xoneterm);
			q = 0;
			r = 0;
			s = bq2 / (4 * aq2);
		}

		if (perfect === false) {
			result = [p2 + q + r - s,
				p2 - q - r - s,
				-p2 + q - r - s,
				-p2 - q + r - s];
			if (result.length > 1) {
				result.sort(compareNumbersAscending);
			}
		}
	}
	if (perfect) {
		result = [ -bq / 4 ];
	}

	if (ipart === 0) {
		if (xtwoterm < 0 && xthreeterm < 0) {
			xtwoterm = -xtwoterm;
			xthreeterm = -xthreeterm;
			p2 = 0;
			q = 0;
			p2ipart = Math.sqrt(xtwoterm);
			qipart = Math.sqrt(xthreeterm);
			const mult = calcMult(p2, p2ipart, q, qipart,0);
			r = -g2 / (8 * mult);
			s = bq2 / (4 * aq2);
			ipart = 1;
		}
		else if (xoneterm > 0 && xtwoterm < 0 && xthreeterm === 0) {
			xtwoterm = -xtwoterm;
			p2 = Math.sqrt(xoneterm);
			q = 0;
			p2ipart = 0;
			qipart = Math.sqrt(xtwoterm);
			const mult = calcMult(p2, p2ipart, q, qipart, 0);
			const mult2 = calcMult(p2, p2ipart, q, qipart, 1);
			r = -g2 / (8 * mult);
			if (mult2 !== 0) {
				r = 0;
			}
			s = bq2 / (4 * aq2);
			ipart = 1;
		}
		else if (xtwoterm === 0 && xthreeterm === 0) {
			p2 = Math.sqrt(xoneterm);
			q = 0;
			r = 0;
			s = bq2 / (4 * aq2);
		}
	}

	if (ipart !== 0) {
		result = [];
		if (p2ipart + qipart === 0) {
			result.push(p2 + q + r - s);
			result.push(r - s - q - p2);
		}
		if (p2ipart - qipart === 0)
			result.push(p2 - q - r - s);
		if (qipart - p2ipart === 0)
			result.push(q - r - s - p2);
		if (result.length > 1) {
			result.sort(compareNumbersAscending);
		}
	}

	if (perfectBiquadratic) {
		if (cq === 0)
			return [0];
		else
			return [];
	}
	else
		return result;
};