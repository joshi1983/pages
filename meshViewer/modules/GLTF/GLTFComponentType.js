export class GLTFComponentType {
	static get BYTE() {
		return 5120;
	}

	static get UNSIGNED_BYTE() {
		return 5121;
	}

	static get SHORT() {
		return 5122;
	}

	static get UNSIGNED_SHORT() {
		return 5123;
	}

	static get UNSIGNED_INT() {
		return 5125;
	}

	static get FLOAT() {
		return 5126;
	}

	static getNumberOfBytes(typeNumber) {
		return {
			5120: 1,
			5121: 1,
			5122: 2,
			5123: 2,
			5125: 4,
			5126: 4
		}[typeNumber];
	}

	static getDataViewReadFunction(typeNumber, dataView) {
		if (!(dataView instanceof DataView))
			throw new Error('DataView must be specified but got ' + dataView);
		var f = {
			'5120': dataView.getInt8,
			'5121': dataView.getUint8,
			'5122': dataView.getInt16,
			'5123': dataView.getUint16,
			'5125': dataView.getUint32,
			'5126': dataView.getFloat32
		}['' + typeNumber];
		if (f === undefined)
		{
			console.error('typeNumber: ', typeNumber);
			throw new Error('Unrecognized ComponentType ' + typeNumber);
		}

		return function(byteOffset) {
			return f.apply(dataView, [byteOffset, true]);
		};
	}
}
