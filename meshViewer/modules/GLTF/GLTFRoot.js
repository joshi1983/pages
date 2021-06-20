import { GLTFScene } from './GLTFScene.js';
import { GLTFNode } from './GLTFNode.js';
import { GLTFAccessor } from './GLTFAccessor.js';
import { GLTFBufferView } from './GLTFBufferView.js';
import { GLTFMesh } from './GLTFMesh.js';
import { GLTFChunk } from './GLTFChunk.js';
import { GLTFUtils } from './GLTFUtils.js';
import { GLTFBuffer } from './GLTFBuffer.js';

export class GLTFRoot {
	constructor(arrayBuffer) {
		if (typeof arrayBuffer === 'string')
			this._loadFromJson(arrayBuffer);
		else
			this._loadFromArrayBuffer(arrayBuffer);
	}

	_loadFromJson(content) {
		var json;
		if (typeof content === 'string')
			json = JSON.parse(content);
		else if (typeof content === 'object')
			json = content;

		var outer = this;
		this.scenes = json.scenes.map(function(sceneObject) {
			return new GLTFScene(sceneObject);
		});
		this.nodes = json.nodes.map(function(nodeObject) {
			return new GLTFNode(nodeObject);
		});
		this.nodes.forEach(function(node) {
			node.loadChildrenFrom(outer.nodes);
		});
		if (json.scene) {
			this.scene = this.scenes[json.scene];
		}
		else if (json.scenes.length > 0) {
			this.scene = this.scenes[0];
		}
		this.scenes.forEach(function(scene) {
			scene.loadNodesFrom(outer.nodes);
		});
		this.accessors = json.accessors.map(function(accessorObject) {
			return new GLTFAccessor(accessorObject);
		});
		this.bufferViews = json.bufferViews.map(function(bufferViewObject) {
			return new GLTFBufferView(bufferViewObject);
		});
		this.accessors.forEach(function(accessor) {
			accessor.loadBufferViewFrom(outer.bufferViews);
		});
		this.buffers = json.buffers.map(function(bufferObject) {
			return new GLTFBuffer(bufferObject);
		});
		this.bufferViews.forEach(function(bufferView) {
			bufferView.loadBuffer(outer.buffers);
		});
		this.meshes = json.meshes.map(function(meshObject) {
			var result = new GLTFMesh(meshObject);
			result.loadAccessors(outer.accessors);
			return result;
		});
		this.nodes.forEach(function(node) {
			node.loadMesh(outer.meshes);
		});
	}

	_loadFromArrayBuffer(arrayBuffer) {
		var dataView = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
		var chunkPositions = GLTFChunk.getChunkPositions(dataView);
		var json = GLTFChunk.parseJSONChunk(arrayBuffer, dataView, chunkPositions.json);
		this.bin = GLTFChunk.getChunk(arrayBuffer, dataView, chunkPositions.bin).data;
		this._loadFromJson(json);
	}

	getTrianglePositions() {
		var result = [];
		var dataView;
		if (this.bin)
			dataView = new DataView(this.bin, 0, this.bin.byteLength);
		for (var i = 0; i < this.scenes.length; i++)
			GLTFUtils.addToArray(result, this.scenes[i].getTrianglePositions(dataView));
		return result;
	}
}