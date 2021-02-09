/*
This is based on the "Iterative Implementation" exlained in:
https://en.wikipedia.org/wiki/Maze_generation_algorithm

This is very similar to RecursiveDepthFirstGenerator except 
we're using a loop and a stack instead of recursion.
*/
class IterativeDepthFirstGenerator {
	constructor() {
		this.name = 'Iterative Depth-First';
		this.offsets = [
			[0, -1],
			[-1, 0],
			[1, 0],
			[0, 1]
		];
	}

	_getRandomizedOffsets() {
		var result = this.offsets.slice(0); 
		// create a clone so the original doesn't mutate.

		for (var i = 0; i < 10; i ++) {
			// select 2 indexes.
			var i1 = Math.floor(Math.random() * (this.offsets.length - 1));
			var i2 = Math.floor(Math.random() * (this.offsets.length - 1));
			if (i2 >= i1)
				i2++; // avoid case when i1 === i2.
			// swap.
			var temp = result[i1];
			result[i1] = result[i2];
			result[i2] = temp;
		}
		return result;
	}

	_isVisitedOrRestricted(maze, currentX, currentY) {
		if (currentX < 0 || currentY < 0 || currentX >= maze.cells.length ||
			currentY >= maze.cells[0].length)
			return true;

		if (maze.cells[currentX][currentY].visited)
			return true;
		
		return false;
	}

	_knockDownWall(maze, newX, newY, offset) {
		// knock down the wall.
		if (offset[0] < 0)
			maze.cells[newX][newY].hasRightWall = false;
		else if (offset[1] < 0)
			maze.cells[newX][newY].hasBottomWall = false;
		else if (offset[0] > 0)
			maze.cells[newX - 1][newY].hasRightWall = false;
		else if (offset[1] > 0)
			maze.cells[newX][newY - 1].hasBottomWall = false;
	}

	generate(maze) {
		maze.clearVisited();
		var currentPoints = [{
			'x': maze.startPoint.x,
			'y': maze.startPoint.y,
			'offsets': this._getRandomizedOffsets()
		}];
		while (currentPoints.length > 0) {
			var currentPoint = currentPoints[currentPoints.length - 1];
			var cell = maze.cells[currentPoint.x][currentPoint.y];
			if (currentPoint.offsets.length <= 1)
				currentPoints.pop();

			cell.setVisited(true);
			var offset = currentPoint.offsets[0];
			currentPoint.offsets.shift(); // remove the offset.
			var newPoint = {
				'x': currentPoint.x + offset[0],
				'y': currentPoint.y + offset[1]
			};
			if (!this._isVisitedOrRestricted(maze, newPoint.x, newPoint.y)) {
				this._knockDownWall(maze, newPoint.x, newPoint.y, offset);
				newPoint.offsets = this._getRandomizedOffsets();
				currentPoints.push(newPoint);
			}
		}
	}
}