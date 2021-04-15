class LineSegment {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	draw(g, colourOverride) {
		if (colourOverride !== undefined)
			g.strokeStyle = colourOverride;
		
		g.moveTo(this.p1.x, this.p1.y);
		g.lineTo(this.p2.x, this.p2.y);
		g.stroke();
	}

	getKeyPoints() {
		return [this.p1, this.p2];
	}

	equals(o) {
		if (typeof o !== 'object')
			return false;
		if (this.p1.equals(o.p1) && this.p2.equals(o.p2))
			return true;
		if (this.p1.equals(o.p2) && this.p2.equals(o.p1))
			return true;

		return false;
	}

	overlapsLineSegment(lineSegment) {
		if (lineSegment.equals(this))
			return true;

		// find intersection point between this and lineSegment.
		

		return false;
	}

	getClosestPointTo(p) {
		var a_to_p = [p.x - this.p1.x, p.y - this.p1.y];
		var a_to_b = [this.p2.x - this.p1.x, this.p2.y - this.p1.y];
		var atb2 = a_to_b[0]*a_to_b[0] + a_to_b[1]*a_to_b[1];
		var atp_dot_atb = a_to_p[0]*a_to_b[0] + a_to_p[1]*a_to_b[1];
          // The dot product of a_to_p and a_to_b
		var t = atp_dot_atb / atb2; // The normalized "distance" from a to
         //   your closest point

		if (t < 0) // if closed to p is opposite direction to p2
			return this.p1;
		else if (t > 1) // if closed to p is paste p2, return p2.
			return this.p2;
		
		var result = new Point(this.p1.x + a_to_b[0]*t,
           this.p1.y + a_to_b[1]*t);

		return result;
	}
}