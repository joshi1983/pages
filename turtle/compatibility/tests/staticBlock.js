// Dependence on this feature was removed from 
// modules/data-types/NumberType.js because 
// Mozilla Firefox version 91.0.2 did not support it.

function test_staticBlock() {
	var isSupported = false;
	class A {
		
		static {
			isSupported = true;
		}
	}
}