
function JuliaSet() {
    var self = this;
    
    self.x = -0.704029749122184;
    self.y = -0.3383527246917294;
    self.name = 'Julia Set';

    self.getInputs = function() {
        return [{'name': 'x', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.x}, {'name': 'y', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.y}];
    };

    self.getValueAt = function(x, y) {
        var n = 255;

        var cRe = self.x;
        var cIm = self.y;
        var newRe = x;
        var newIm = y;
        for(var i = 0; i < 255; i++)
        {
          //remember value of previous iteration
          var oldRe = newRe;
          var oldIm = newIm;
          //the actual iteration, the real and imaginary part are calculated
          newRe = oldRe * oldRe - oldIm * oldIm + cRe;
          newIm = 2 * oldRe * oldIm + cIm;
          //if the point is outside the circle with radius 2: stop
          if((newRe * newRe + newIm * newIm) > 4) break;
        }
    
        return i;
    };
}