var create_polygon = function (vertices) {
    return {
	vertices: vertices,
	draw: function (context, units_to_pixels) {
	    
	    var screen_coords = vertices.map(units_to_pixels);

	    // push the first element onto the end in order to do a line loop
	    screen_coords.push(screen_coords[0]);

	    context.beginPath();
	    for(var i = 0; i < vertices.length + 1; i++) {
		context.lineTo(screen_coords[i].x, screen_coords[i].y);
	    }
	    context.stroke();
	}
    }
};
