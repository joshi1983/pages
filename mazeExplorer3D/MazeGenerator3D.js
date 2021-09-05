class MazeGenerator3D {
	_getMaxRangeNumberFromAxis(coordinates, axis) {
		var min = Number.MAX_VALUE;
		var max = -Number.MAX_VALUE;
		coordinates.forEach(function(point) {
			min = Math.min(min, point[axis]);
			max = Math.max(max, point[axis]);
		});
		return max - min;
	}

	_getMaxRangeNumberFrom(coordinates) {
		return Math.max(
			this._getMaxRangeNumberFromAxis(coordinates, 0),
			this._getMaxRangeNumberFromAxis(coordinates, 1),
			this._getMaxRangeNumberFromAxis(coordinates, 2)
		);
	}

	_addQuadWithCoordinates(triangles, coordinates, colour, textureCoordinates) {
		if (textureCoordinates === undefined) {
			var width = this._getMaxRangeNumberFrom(coordinates);
			textureCoordinates = [
				[0, 0],
				[0, 1],
				[width, 1],
				[width, 0]
			];
		}
		coordinates = coordinates.map(function(coordinateTriple, index) {
			return new Vertex(coordinateTriple, colour, textureCoordinates[index]);
		});
		triangles.push(new Triangle(coordinates.slice(0, 3)));
		triangles.push(new Triangle([coordinates[0], coordinates[2], coordinates[3]]));
	}

	_addQuad(triangles, x, z, dx, dz) {
		var coordinates = [
			[x, 0, z],
			[x, 1, z]
		];
		var scale = Math.max(dx, dz);
		var textureCoordinates = [
			[0, 0],
			[0, 1],
			[scale, 1],
			[scale, 0]
		];
		if (dx !== 0) {
			coordinates.push(
				[x + dx, 1, z],
				[x + dx, 0, z]
			);
		}
		else {
			coordinates.push(
				[x, 1, z + dz],
				[x, 0, z + dz]
			);
		}
		this._addQuadWithCoordinates(triangles, coordinates, [1, 1, 1], textureCoordinates);
	}

	_addBottom(triangles, width, height) {
		var coordinates = [
			[0, 0, 0],
			[0, 0, height],
			[width, 0, height],
			[width, 0, 0],
		];
		this._addQuadWithCoordinates(triangles, coordinates, [0.1, 0.5, 0.05]);
	}

	_addTopLeft(triangles, width, height) {
		this._addQuad(triangles, 0, 0, width, 0);
		this._addQuad(triangles, 0, 0, 0, height);
	}

	getTriangles(width, height) {
		var generator = new IterativeDepthFirstGenerator();
		var maze = Maze.createEmpty(width, height);
		this.maze = maze;
		generator.generate(maze);
		
		// convert all walls to triangles.
		var result = [];
		this._addBottom(result, width, height);
		this._addTopLeft(result, width, height);
		
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				var cell = maze.cells[x][y];
				if (cell.hasRightWall) {
					this._addQuad(result, x + 1, y, 0, 1);
				}
				if (cell.hasBottomWall) {
					this._addQuad(result, x, y + 1, 1, 0);
				}
			}
		}
		this.physics = new Physics(maze, result);
		return result;
	}
}