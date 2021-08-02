
export class PLYDataTypes
{
	static sanitizeDataType(typeName) {
		// convert some synonymous types.
		const conversions = {
			'float': 'float32',
			'int': 'int32',
			'ulong': 'uint64',
			'long': 'int64', 
			// just in case "long" shows up.  long wasn't mentioned in the wikipedia article, though.
			'ushort': 'uint16',
			'short': 'int16',
			'double': 'float64',
			'uchar': 'uint8',
			'char': 'int8'
		};
		if (conversions[typeName] === undefined)
			return typeName;
		else
			return conversions[typeName];
	}

	static getByteSize(typeName) {
		const keys = {
			'float32': 4,
			'float64': 8,
			'int8': 1,
			'uint8': 1,
			'int16': 2,
			'uint16': 2,
			'int32': 4,
			'uint32': 4,
			// 64-bit integers not mentioned in wikipedia article but trying to 
			// make this loader robust enough to handle them anyway.
			'int64': 8, 
			'uint64': 8
		};
		if (keys[typeName] === undefined)
			return 4;
		else
			return keys[typeName];
	}
}