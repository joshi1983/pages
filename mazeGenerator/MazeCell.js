class MazeCell {
	constructor(hasBottomWall, hasRightWall) {
		this.hasBottomWall = hasBottomWall;
		this.hasRightWall = hasRightWall;
		this.visited = false; // used by maze generators.
	}

	setVisited(visited) {
		this.visited = visited;
	}

	draw(g, left, top, cellSize) {
		if (this.hasBottomWall) {
			g.moveTo(left, top + cellSize);
			g.lineTo(left + cellSize, top + cellSize);
		}
		if (this.hasRightWall) {
			g.moveTo(left + cellSize, top);
			g.lineTo(left + cellSize, top + cellSize);
		}
	}
}