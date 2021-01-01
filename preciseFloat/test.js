var preciseFloat;
for (var i = -2; i < 5; i++) {
	preciseFloat = new PreciseFloat(i);
	if (i !== preciseFloat.toNumber())
		console.log('Error: ' + i + ' = ' + preciseFloat.toNumber());
}
var tests = [3.14, 2.5, -0.5, -3.5, -3.14, 3.14159265];
for (var i = 0; i < tests.length; i++) {
	preciseFloat = new PreciseFloat(tests[i]);
	if (tests[i] !== preciseFloat.toNumber())
		console.log('Error: ' + tests[i] + ' = ' + preciseFloat.toNumber());
}

var val = new PreciseFloat(1);
val.add(2);
console.log('3 = ' + val.toNumber());
val.add(-2);
console.log('1 = ' + val.toNumber());
val.add(0.5);
console.log('1.5 = ' + val.toNumber());
val.add(-0.5);
console.log('1 = ' + val.toNumber());
val.add(-1.5);
console.log('-0.5 = ' + val.toNumber());

val = new PreciseFloat(1);
val.multiply(0);
console.log('0 = ' + val.toNumber());
val = new PreciseFloat(1);
val.multiply(2);
console.log('2 = ' + val.toNumber());
val.multiply(3.14);
console.log('6.28 = ' + val.toNumber());

val = new PreciseFloat(2);
val.square();
console.log('4 = ' + val.toNumber());

val = new PreciseFloat(31.622776601683793319988935444327);
val.square();
console.log('1000 = ' + val.toNumber());

val.getSquare();
console.log('1000 = ' + val.toNumber()); // getSquared should not change the value in val.
console.log('1000000 = ' + val.getSquare().toNumber());

val = new PreciseFloat(20);
val.subtract(1);
console.log("19 = " + val.toNumber());
val.subtract(0.5);
console.log("18.5 = " + val.toNumber());
val.subtract(-0.5);
console.log("19 = " + val.toNumber());
val.negate();
console.log("-19 = " + val.toNumber());
val = new PreciseFloat(100);
val.divideBy(2);
console.log("50 = " + val.toNumber());
val.divideBy(2);
console.log("25 = " + val.toNumber());
val.divideBy(2);
console.log("12.5 = " + val.toNumber());
val.negate();
val.divideBy(2);
console.log("-6.25 = " + val.toNumber());
val = new PreciseFloat(-2);
console.log('-1 = ' + val.compare(1));
console.log('0 = ' + val.compare(-2));
console.log('1 = ' + val.compare(-3));
console.log('-1 = ' + val.compare(3));
