class MazeSolver {
	
}

MazeSolver.solve = function(maze) {
	function isPossibleMove(from, to) {
		// if the to position is outside the maze or already visited, 
		// the move is not possible.
		if (to.x < 0 || to.x >= maze.cells.length ||
			to.y < 0 || to.y >= maze.cells[0].length ||
			maze.cells[to.x][to.y].visited)
			return false;
		
		// is there a wall between from and to?
		if (from.x < to.x && maze.cells[from.x][from.y].hasRightWall)
			return false;
		if (from.x > to.x && maze.cells[to.x][to.y].hasRightWall)
			return false;
		if (from.y < to.y && maze.cells[from.x][from.y].hasBottomWall)
			return false;
		if (from.y > to.y && maze.cells[to.x][to.y].hasBottomWall)
			return false;
		
		return true;
	}
	
	maze.clearVisited();
	const offsets = [
		[0, -1],
		[-1, 0],
		[1, 0],
		[0, 1]
	];
	var positions = [{
		'x': maze.startPoint.x,
		'y': maze.startPoint.y,
		'path': []
	}];
	positions[0].path.push(positions[0]);
	maze.cells[positions[0].x][positions[0].y].setVisited(true);
	while (positions.length > 0) {
		var p = positions[0];
		positions.shift(); // remove first element.
		for (var offsetIndex = 0; offsetIndex < offsets.length; offsetIndex++) {
			var offset = offsets[offsetIndex];
			var newPoint = {
				'x': p.x + offset[0],
				'y': p.y + offset[1],
			};
			// if the point might yet get visited, add it to the queue.
			if (isPossibleMove(p, newPoint)) {
				newPoint.path = p.path.slice(0);// clone so we don't mutate a path that is shared.
				newPoint.path.push(newPoint);
				maze.cells[newPoint.x][newPoint.y].setVisited(true);
				if (newPoint.x === maze.endPoint.x && newPoint.y === maze.endPoint.y) {
					// solved.  Return solution.
					return newPoint.path;
				}
				positions.push(newPoint);
			}
		}
	}
	throw new Error('Unable to solve maze.  No path found between start and end.');
};
