class GLTFChunk {
	static getChunk(arrayBuffer, dataView, offset) {
		var len = dataView.getUint32(offset, true);
		var type = dataView.getUint32(offset + 4, true);
		offset += 8;
		return {
			'type': type,
			'data': arrayBuffer.slice(offset, offset + len)
		};
	}

	static _utf8DecodeArrayBuffer(arrayBuffer) {
		var result = [];
		var bytes = new Uint8Array(arrayBuffer);
		for (var i = 0; i < bytes.length; i++) {
			result.push(String.fromCharCode(bytes[i]));
		}
		return result.join('');
	}

	static parseJSONChunk(arrayBuffer, dataView, offset) {
		// get first chunk.
		var chunk = GLTFChunk.getChunk(arrayBuffer, dataView, offset);
		if (chunk.type !== GLTFChunkType.JSON)
			console.error('JSON chunk type expected(' + GLTFChunkType.JSON + ') but found: ' + chunk.type);
		return JSON.parse(GLTFChunk._utf8DecodeArrayBuffer(chunk.data));
	}

	static getChunkPositions(dataView) {
		var json;
		var bin;
		var offset = 12;
		while (json === undefined || bin === undefined) {
			let len = dataView.getUint32(offset, true);
			let type = dataView.getUint32(offset + 4, true);
			if (type === GLTFChunkType.JSON)
				json = offset;
			else if (type !== GLTFChunkType.BIN)
				throw new Error('Expected JSON or BIN type but found: ' + type);
			else
				bin = offset;
			offset += 8 + len;
		}
		return {
			'json': json,
			'bin': bin
		};
	}
}