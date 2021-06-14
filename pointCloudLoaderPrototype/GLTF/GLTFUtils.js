class GLTFUtils {
	static base64ToArrayBuffer(base64) {
		var index = base64.indexOf(',');
		if (index >= 0)
			base64 = base64.substring(index + 1);
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	static addToArray(a1,a2) {
		if (!(a1 instanceof Array))
			throw new Error('a1 is not an Array.  a1 is ' + a1);
		if (!(a2 instanceof Array))
			throw new Error('a2 is not an Array.  a2 is ' + a2);
		for (var i = 0; i < a2.length; i++) {
			a1.push(a2[i]);
		}
	}
}