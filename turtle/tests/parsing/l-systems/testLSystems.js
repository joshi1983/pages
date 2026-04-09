import { test0L } from
'./0L/test0L.js';/*
import { testCGJennings } from
'./cgjennings/testCGJennings.js';
import { testFractInt } from
'./fractint/testFractInt.js';*/
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testLSystems(logger) {
	wrapAndCall([
		test0L,
		//testCGJennings,
		//testFractInt
	], logger);
};