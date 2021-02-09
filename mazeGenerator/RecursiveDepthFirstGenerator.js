/*
This is based on the "Recursive Implementation" exlained in:
https://en.wikipedia.org/wiki/Maze_generation_algorithm
*/
class RecursiveDepthFirstGenerator {
	constructor() {
		this.name = 'Recursive Depth-First';
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

	_generate(maze, currentX, currentY) {
		if (!(maze instanceof Maze))
			throw new Error('_generate must be called with a Maze as first parameter.  Not: ', maze);
		if (isNaN(currentX))
			throw new Error('currentX must be a number.  Not: ' + currentX);
		if (isNaN(currentY))
			throw new Error('currentY must be a number.  Not: ' + currentY);

		if (currentX < 0 || currentY < 0 || currentX >= maze.cells.length ||
			currentY >= maze.cells[0].length)
			return false;

		if (maze.cells[currentX][currentY].visited)
			return false;

		maze.cells[currentX][currentY].setVisited(true);
		var outer = this;
		this._getRandomizedOffsets().forEach(function(offset) {
			var newPoint = {
				'x': currentX + offset[0],
				'y': currentY + offset[1]
			};
			if (outer._generate(maze, newPoint.x, newPoint.y)) {
				// knock down the wall.
				if (offset[0] < 0)
					maze.cells[newPoint.x][newPoint.y].hasRightWall = false;
				else if (offset[1] < 0)
					maze.cells[newPoint.x][newPoint.y].hasBottomWall = false;
				else if (offset[0] > 0)
					maze.cells[currentX][currentY].hasRightWall = false;
				else if (offset[1] > 0)
					maze.cells[currentX][currentY].hasBottomWall = false;
			}
		});
		return true;
	}

	generate(maze) {
		maze.clearVisited();
		this._generate(maze, maze.startPoint.x, maze.startPoint.y);
	}
}