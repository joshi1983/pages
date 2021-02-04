class PLYFileFormatExporter {
	_getHeader(triangles, verticesInfo, format) {
		var result = 'ply\n';
		result += 'format ' + format + '\n';
		result += 'element vertex ' + verticesInfo.verticesArray.length + '\n';
		result += `property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
`;
		result += 'element face ' + triangles.length + '\n';
		result += 'property list uchar int vertex_indices\n';
		result += 'end_header\n';
		return result;
	}

	_getVerticesInfo(triangles) {
		var verticesObject = {};
		triangles.forEach(function(triangle) {
			triangle.vertices.forEach(function(vertex) {
				var key = vertex.getHashString();
				verticesObject[key] = Vertex.clone(vertex);
			});
		});
		// associate indexes with each vertex.
		var i = 0;
		var verticesArray = [];
		for (var key in verticesObject) {
			verticesObject[key].index = i;
			verticesArray.push(verticesObject[key]);
			i++;
		}
		return {
			'verticesObject': verticesObject,
			'verticesArray': verticesArray
		};
	}

	_stringToBinary(s, dataView) {
		for (var i = 0; i < s.length; i++) {
			dataView.setUint8(i, s.charCodeAt(i));
		}
	}

	trianglesToBlob(triangles) {
		// print header.
		var verticesInfo = this._getVerticesInfo(triangles);
		var header = this._getHeader(triangles, verticesInfo, 'binary_big_endian 1.0');
		var littleEndian = false;
		var vertexByteCount = 3 * 4 + 3; 
		// 3 coordinates.  Each are float32.  3 r, g, b components.  Each are uint8.
		
		var triangleByteCount = 1 + 3 * 4; // the constant 3 takes 1 byte followed by 3 int32.
		var a = new ArrayBuffer(header.length + 
			vertexByteCount * verticesInfo.verticesArray.length +
			triangleByteCount * triangles.length);
		var dataView = new DataView(a);
		var index = 0;
		this._stringToBinary(header, dataView);
		index = header.length;
		// add the vertex information.
		for (var i = 0; i < verticesInfo.verticesArray.length; i++) {
			var v = verticesInfo.verticesArray[i];
			for (var positionIndex = 0; positionIndex < 3; positionIndex++) {
				dataView.setFloat32(index, v.position[positionIndex], littleEndian);
				index += 4;
			}
			for (var colourIndex = 0; colourIndex < 3; colourIndex++) {
				dataView.setUint8(index, Math.min(255, Math.max(0, Math.floor(v.colour[colourIndex] * 256))));
				index ++;
			}
		}
		// add the face information.
		for (var i = 0; i < triangles.length; i++) {
			dataView.setUint8(index, 3); // 3 vertices per face.
			index++;
			var triangle = triangles[i];
			for (var vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
				var v = triangle.vertices[vertexIndex];
				var key = v.getHashString();
				var vObject = verticesInfo.verticesObject[key];
				dataView.setInt32(index, vObject.index, littleEndian);
				index += 4;
			}
		}

		return new Blob([a],
		{
			type : "application/octet-stream"
		});
	}
}