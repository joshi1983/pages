import { GLTFBufferView } from './GLTFBufferView.js';
import { GLTFBuffer } from './GLTFBuffer.js';
import { GLTFComponentType } from './GLTFComponentType.js';
import { GLTFAccessorType } from './GLTFAccessorType.js';
import { GLTFUtils } from './GLTFUtils.js';

export class GLTFAccessor {
	constructor(o) {
		if (typeof o.bufferView === 'number') {
			if (isNaN(o.bufferView) || o.bufferView < 0)
				throw new Error('bufferView expected to be a positive integer but found ' + o.bufferView);
			this.bufferView = o.bufferView;
		}
		this.byteOffset = o.byteOffset;
		this.byteStride = o.byteStride;
		this.componentType = o.componentType;
		this.count = o.count;
		this.type = o.type;
	}

	loadBufferViewFrom(bufferViews) {
		if (typeof this.bufferView === 'object')
			throw new Error('BufferView already loaded.');
		if (typeof this.bufferView === 'number') {
			if (this.bufferView < 0 || this.bufferView >= bufferViews.length)
				throw new Error('bufferView(' + this.bufferView + ') out of range 0..' + (bufferViews.length - 1));
			this.bufferView = bufferViews[this.bufferView];
		}
	}

	_checkDataURLOverride(binDataView) {
		if (this.bufferView instanceof GLTFBufferView &&
		this.bufferView.buffer instanceof GLTFBuffer &&
		typeof this.bufferView.buffer.uri === 'string')
		{
			var arrayBuffer = GLTFUtils.base64ToArrayBuffer(this.bufferView.buffer.uri);
			var dataView = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
			return dataView;
		}
		else {
			return binDataView;
		}
	}

	get(binDataView) {
		binDataView = this._checkDataURLOverride(binDataView);
		var byteOffset = this.byteOffset;
		if (isNaN(byteOffset) && typeof this.bufferView.byteOffset === 'number')
			byteOffset = this.bufferView.byteOffset;
		if (typeof this.bufferView.buffer.byteOffset === 'number')
			byteOffset = this.bufferView.buffer.byteOffset;
		var numComponents = GLTFAccessorType.getNumberOfComponents(this.type);
		var numBytesPerComponent = GLTFComponentType.getNumberOfBytes(this.componentType);
		var byteStride = numBytesPerComponent * numComponents;
		if (typeof this.byteStride === 'number')
			byteStride = this.byteStride;
		if (typeof this.bufferView === 'object' && typeof this.bufferView.byteStride === 'number')
			byteStride = this.bufferView.byteStride;
		if (isNaN(byteStride) || typeof byteStride !== 'number')
		{
			console.error('numBytesPerComponent = ' + numBytesPerComponent + ', numComponents = ' + numComponents);
			throw new Error('byteStride is not a number.  byteStride = ' + byteStride);
		}
		var result = [];
		var readFunc = GLTFComponentType.getDataViewReadFunction(this.componentType, binDataView);
		for (var i = 0; i < this.count; i++) {
			let e = undefined;
			if (numComponents === 1)
				e = readFunc(byteOffset);
			else {
				e = [];
				for (var j = 0; j < numComponents; j++) {
					e.push(readFunc(byteOffset + numBytesPerComponent * j));
				}
			}
			result.push(e);
			byteOffset += byteStride;
		}
		return result;
	}
}