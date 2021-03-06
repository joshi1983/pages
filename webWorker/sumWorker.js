self.onmessage = function(e) { 
    if(e.data !== undefined) { 
        var total = e.data.num1 + e.data.num2; 
        self.postMessage(total) 
    } 
} 