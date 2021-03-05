const digitsPerIteration = 14;

var factorialCache = {};

function factorial(n) {
	var result = new Decimal(1);
	for (var i = n; i >= 2; i--) {
		if (factorialCache[i] !== undefined) {
			result = result.times(factorialCache[i]);
			break;
		}
		result = result.times(i);
	}
	if (n % 10 === 0) {
		factorialCache[n] = result;
	}
	return result;
}

function getPi(digits) {
  // Chudnovsky algorithm for calculating Pi.

  Decimal.precision = digits + 2;

  var pi = new Decimal(0);
  var C, Mk, Lk, Xk;
  var iterations = (digits / digitsPerIteration) + 1;

  for (var k = 0; k < iterations; k++) {
      // Multinomial term, Mk = (6k)! / (3k)! * (6k)!^3
      Mk = Decimal(factorial(6 * k)).div(Decimal(factorial(3 * k)).times(Decimal(factorial(k)).pow(3)));

      // Linear term, Lk = 545140134k + 13591409
      Lk = Decimal(545140134 * k).plus(13591409);

      // Exponential term, Xk = -262537412640768000^k
      Xk = Decimal(-262537412640768000).pow(k);

      // Pi series partial summation.
      pi = pi.plus(Mk.times(Lk).div(Xk));
  }

  // C = 1 / (426880 * 10005^0.5)
  C = Decimal(1).div(Decimal(426880).times(Decimal(10005).sqrt()));

  // Multiply by constant and take reciprocal.
  pi = Decimal(1).div(C.times(pi));

  // Set significant digits.
  pi = pi.toSD(digits);
  return pi;
}