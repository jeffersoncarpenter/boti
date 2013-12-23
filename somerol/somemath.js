
// "cross product" of 2d vectors
var cross_product = function (point1, point2) {
    return p1.x * p2.y - p1.y * p2.x;
};


var add_points = function (point1, point2) {
    return {
	x: point1.x + point2.x,
	y: point1.y + point2.y
    };
};

var subtract_points = function (point2, point1) {
    return {
	x: point2.x - point1.x,
	y: point2.y - point1.y
    };
};


// returns whether two segments cross
var segments_cross = function (segment_1_point_1,
			       segment_1_point_2,
			       segment_2_point_1,
			       segment_2_point_2) {
    // this can be done by checking whether the points of each
    // segment are on opposite sides of the other segment

    var points_on_opposite_sides_of_segment = function (segment_end_1,
							segment_end_2,
							point_1,
							point_2) {

	var segment_vector = subtract_points(segment_end_2, segment_end_1);
	var point_1_vector = subtract_points(point_1, segment_end_1);
	var point_2_vector = subtract_points(point_1, segment_end_2);

	var point_1_to_segment = cross_product(point_1_vector, segment_vector);
	var point_2_to_segment = cross_product(point_2_vector, segment_vector);

	// points are on opposite sides if the cross products have opposite signs
	return point_1_to_segment * point_2_to_segment < 0;
    };
};

var distance = function (point1, point2) {
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
};
