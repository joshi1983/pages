import { compareNumbersAscending } from '../../compareNumbersAscending.js';

/*
Adapted from:
https://gist.github.com/weepy/6009631

The changes are:
- change returned Array elements to only real numbers 
instead of objects representing all 3 complex solutions.
- ensure real numbers in results are sorted from smallest to largest.
- use Math.cbrt instead of Math.pow for extra efficiency and cleaner code.

Returns an Array of x-values such that a*x*x*x + b*x*x + c*x + d = 0.
*/
export function solveCubic(a, b, c, d) {
	b /= a;
	c /= a;
	d /= a;

	var discrim, q, r, dum1, s, t, term1, r13;

	q = (3.0*c - (b*b))/9.0;
	r = -(27.0*d) + b*(9.0*c - 2.0*(b*b));
	r /= 54.0;
	discrim = q*q*q + r*r;

	term1 = b/3.0;

	if (discrim > 0) { // one root real, two are complex
		discrim = Math.sqrt(discrim);
		s = Math.cbrt(r + discrim);
		t = Math.cbrt(r - discrim);

		return [-term1 + s + t];
	} // End if (discrim > 0)

	// The remaining options are all real

	if (discrim === 0) { // All roots real, at least two are equal.
		r13 = Math.cbrt(r);
		const val1 = -term1 + 2.0 * r13;
		const val2 = -(r13 + term1);
		if (val1 === val2)
			return [val1];
		else if (val1 < val2)
			return [val1, val2];
		else
			return [val2, val1];
	} // End if (discrim == 0)

	// Only option left is that all roots are real and unequal (to get here, q < 0)
	q = -q;
	dum1 = q * q * q;
	dum1 = Math.acos(r/Math.sqrt(dum1));
	r13 = 2.0 * Math.sqrt(q);

	const roots = [
		-term1 + r13 * Math.cos(dum1/3.0),
		-term1 + r13 * Math.cos((dum1 + 2.0*Math.PI)/3.0),
		-term1 + r13 * Math.cos((dum1 + 4.0*Math.PI)/3.0)
	];
	roots.sort(compareNumbersAscending);

	return roots;
}