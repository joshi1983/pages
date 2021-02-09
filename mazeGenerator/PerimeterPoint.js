/*
Each PerimeterPoint represents a point at the start or end in a maze.
These points are typically on the perimeter of a maze.
*/
class PerimeterPoint {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw(g, left, top, cellSize) {
		left += cellSize * this.x;
		top += cellSize * this.y;
		var ratio1 = 0.7;
		var ratio2 = 1 - ratio1;
		var cellSize2 = ratio2 * cellSize;
		var cellSize1 = cellSize - cellSize2;

		// Draw an X.
		g.moveTo(left + cellSize2, top + cellSize2);
		g.lineTo(left + cellSize1, top + cellSize1);
		g.moveTo(left + cellSize2, top + cellSize1);
		g.lineTo(left + cellSize1, top + cellSize2);
		g.stroke();
	}
}