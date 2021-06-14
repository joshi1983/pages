function runAccessorTests(addMessage_) {
	addMessage = function(msg) {
		addMessage_('Accessor test: ' + msg);
	};
	var arrayBuffer = new ArrayBuffer(32);
	var dataView = new DataView(arrayBuffer, 0, 32);
	var accessor;

	function runUint8Tests() {
		accessor = new GLTFAccessor({
			'type': GLTFAccessorType.SCALAR,
			'componentType': GLTFComponentType.UNSIGNED_BYTE,
			'byteOffset': 0,
			'count': 1,
		});
		for (var i = 0; i < 256; i++) {
			dataView.setUint8(0, i);
			var result = accessor.get(dataView);
			var prefix = 'Uint8 test ' + i + ': ';
			if (!(result instanceof Array))
				addMessage(prefix + 'Expected Array');
			if (result.length !== 1)
				addMessage(prefix + 'Expected array with length of 1 but got ' + result.length);
			else if (result[0] !== i) {
				addMessage(prefix + 'Expected ' + i + ' but found ' + result[0]);
			}
		}
		var expected = [];
		for (var i = 0; i < 32; i++) {
			expected.push(i + 1);
			dataView.setUint8(i, expected[expected.length - 1]);
		}
		accessor = new GLTFAccessor({
			'type': GLTFAccessorType.SCALAR,
			'componentType': GLTFComponentType.UNSIGNED_BYTE,
			'byteOffset': 0,
			'count': 32,
		});
		var result = accessor.get(dataView);
		for (var i = 0; i < 32; i++)
			if (result[i] !== expected[i]) {
				addMessage('Expected ' + JSON.stringify(expected) + ' but found ' + JSON.stringify(result));
				break;
			}
	}

	function runVEC3Tests() {
		accessor = new GLTFAccessor({
			'type': GLTFAccessorType.VEC3,
			'componentType': GLTFComponentType.FLOAT,
			'byteOffset': 0,
			'count': 1
		});
		for (var i = -4.5; i < 5; i += 0.5) {
			var prefix = 'VEC3 test with i of ' + i + ': ';
			var inputVals = [];
			for (var ci = 0; ci < 3; ci++) {
				inputVals.push(i + ci);
				dataView.setFloat32(ci * 4, inputVals[inputVals.length - 1], true);
			}
			var result = accessor.get(dataView);
			if (!(result instanceof Array))
				addMessage(prefix + 'Expected Array');
			else if (result.length !== 1)
				addMessage(prefix + 'Expected Array length of 1 but got ' + result.length);
			else if (!(result[0] instanceof Array))
				addMessage(prefix + 'Expected [0] to be an Array but got ' + result[0]);
			else if (result[0].length !== 3)
				addMessage(prefix + 'Expected [0].length to be 3 but got ' + result[0].length);
			else {
				for (var index = 0; index < inputVals.length; index++) {
					var inputVal = inputVals[index];
					if (inputVal !== result[0][index]) {
						addMessage(prefix + 'Expected ' + JSON.stringify(inputVals) + ', but got ' + JSON.stringify(result[0]));
						break;
					}
				}
			}
		}
	}

	runUint8Tests();
	runVEC3Tests();
}