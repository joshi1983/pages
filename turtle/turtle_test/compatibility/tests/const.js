function test_const() {
	const x = 5;
	if (x !== 5)
		throw new Error('x expected to be 5 but got ' + x);
	try {
		x = 10;
		throw new Error('Second assignment to const x did NOT throw an exception which means const is not working properly. x='+x);
	}
	catch (e) {
		
	}
}