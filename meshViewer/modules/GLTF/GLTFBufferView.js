export class GLTFBufferView {
	constructor(o) {
		this.buffer = o.buffer;
		this.byteLength = o.byteLength;
		this.byteOffset = o.byteOffset;
		this.byteStride = o.byteStride;
	}

	loadBuffer(buffers) {
		if (typeof this.buffer === 'object')
			throw new Error('buffer already loaded.');
		this.buffer = buffers[this.buffer];
	}
}