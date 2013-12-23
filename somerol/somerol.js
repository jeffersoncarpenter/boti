// module SomeROL
var SomeROL = (function () {

    // SomeROL gets assigned to somerol
    // this means fields of somerol are public members of SomeROL
    var somerol = {};

    
    // 2d graphics context is initialized in init function, which must be called first
    var context;

    
    // camera state object
    // also provides some functions for testing whether things are on the screen
    // and for converting between units and pixels
    var camera;


    // game maps
    var maps = [];


    // array of callbacks to run on mouse move
    // anything interested can sign up using the public function below
    var mouse_listeners = [];


    // array of callbacks to run on key press
    // anything interested can sign up using the public function below
    var key_listeners = [];


    // game instance state god object
    // instanced by calling public method create_game()
    // all methods on game return game, so they can be chained
    var game;


    // public function that hooks up somerol to an 800x600 canvas
    // must be called first
    somerol.init = function (canvas) {

	context = canvas.getContext("2d");

	var mouse_event = function (e) {

	    // add x and y properties to event object
	    // x and y are in units on game map
	    var point = camera.pixels_to_units({
		x: e.clientX,
		y: e.clientY
	    });

	    e.x = point.x;
	    e.y = point.y;

	    for(var i = 0; i < mouse_listeners.length; i++) {
		mouse_listeners[i](e);
	    }
	};

	$(canvas).on("mousemove", mouse_event);
	$(canvas).on("click", mouse_event);


	// add mouse listener that selects objects
	somerol.add_mouse_listener(function (event) {
	    if(event.type === "click") {
		game.each_entity(function (entity) {
		    if(entity.contains_point(event)) {
			game.select(entity);
		    }
		});
	    }
	});


	// add a method to the 2d context that clears the canvas
	context.clear = function () {
	    canvas.width = canvas.width;
	};
    };



    camera = {

	// position of camera in units
	position: {
	    x: 0,
	    y: 0
	},


	// width and height of viewport, in units
	width: 8,
	height: 6,


	// functions that help get the camera rectangle
	// these all work in units
	get_min_corner: function () {
	    return {
		x: camera.position.x - (camera.width / 2),
		y: camera.position.y - (camera.width / 2)
	    };
	},

	get_max_corner: function () {
	    return {
		x: camera.position.x + (camera.width / 2),
		y: camera.position.y + (camera.width / 2)
	    };
	},

	get_screen_corners: function () {

	    var min_corner = get_min_corner();
	    var max_corner = get_max_corner();
	    
	    return [{
		x: min_corner.x,
		y: min_corner.y
	    }, {
		x: min_corner.x,
		y: max_corner.y
	    }, {
		x: max_corner.x,
		y: max_corner.y
	    }, {
		x: max_corner.x,
		y: min_corner.y
	    }];
	},

	get_screen_edges: function () {
	    
	    var corners = camera.get_screen_corners();
	    return [
		[corners[0], corners[1]],
		[corners[1], corners[2]],
		[corners[2], corners[3]],
		[corners[3], corners[0]]
	    ];
	},

	
	// the conversion factor
	pixels_per_unit: 100,

	
	// converts point from units to pixels on camera screen
	units_to_pixels: function (point) {

	    var pixels_per_unit = camera.pixels_per_unit;

	    return {
		x: (point.x - (camera.position.x - camera.width / 2)) * pixels_per_unit,
		y: (point.y - (camera.position.y - camera.height / 2)) * pixels_per_unit,
	    };
	},
	pixels_to_units: function (point) {
	    
	    var pixels_per_unit = camera.pixels_per_unit;
	    
	    return {
		x: (point.x / pixels_per_unit) + (camera.position.x - camera.width / 2),
		y: (point.y / pixels_per_unit) + (camera.position.y - camera.height / 2)
	    };
	},


	// returns whether the point is on the camera screen
	sees_point: function (point) {

	    var min_corner = camera.get_min_corner();
	    var max_corner = camera.get_max_corner();
	    
	    return point.x > min_corner.x && point.x < max_corner.x &&
		   point.y > min_corner.y && point.y < max_corner.y;
	},


	// returns whether the line segment is visible to the camera
	sees_line_segment: function (endpoint1, endpoint2) {

	    // segment is visible if either endpoint is visible
	    // or if it intersects any screen edge

	    if(camera.sees_point(endpoint1) || camera.sees_point(endpoint2)) {
		return true;
	    }


	    var edges = get_screen_edges();

	    for(var i = 0; i < 4; i++) {

		var edge = edges[i];

		if(segments_cross(edge[0], edge[1], endpoint1, endpoint2)) {
		    return true;
		}
	    }

	    
	    // neither endpoint is visible, and segment does not cross any screen edge
	    return false;
	},
    };


    // public function to add maps
    somerol.add_map = function (map) {
	maps.push(map);
    };
    

    // add some built-in maps
    // the data model for maps is completely made-up here
    somerol.add_map({
	width: 100,
	height: 100,
	starting_locations: [
	    {x: 10, y: 10},
	    {x: 90, y: 90}
	],
	quarries: [
	    {
		position: {
		    x: 10,
		    y: 12
		},
		miners: 10
	    }, {
		position: {
		    x: 90,
		    y: 88
		},
		miners: 10
	    }
	]});


    // signs up a mouse listener
    // mouse listeners are passed the event object, but
    // with additional x and y properties that are units on the map
    somerol.add_mouse_listener = function (mouse_listener) {
	mouse_listeners.push(mouse_listener);
    };

    
    // signs up a key press listener
    // listeners are passed the event object
    somerol.add_key_listener = function (key_listener) {
	key_listeners.push(key_listener);
    };


    
    // creates an object with stubs and initial values for all the metadata and methods
    var create_entity = function () {
	return {
	    
	    // lists the types of an entity
	    // each create_* method has a property create_*.type identifying it
	    // this and the types property allows entities to be queried by type
	    types: [create_entity.type],
	    

	    // returns true if this entity is of the given type
	    // for example:
	    // if(entity.is_a(create_city.type)) { ... }
	    is_a: function (type) {
		for(var i = 0; i < this.types.length; i++) {
		    if(this.types[i] === type) {
			return true;
		    }
		}
		return false;
	    },

	    
	    // called whenever entity is selected or deselected
	    select: function () {},
	    deselect: function () {},


	    // returns whether given entity conatins an (x,y) point in units
	    contains_point: function (point) { return false; },

	    // returns whether given entity collides with this entity
	    collides_with: function (entity) { return false; },

	    // calback to run when entity is selected and a mouse event happens
	    mouse_callback: function (e) {},

	    // callback to run when entity is selected and a keyboard event happens
	    keyboard_callback: function (e) {},
	    

	    // called each time the screen is redrawn
	    draw: function () {}
	};
    };
    create_entity.type = "entity";


    // City constructor
    var create_city = function (position) {
	
	var city = create_entity();
	city.types.push(create_city.type);

	city.position = position;



	// city mesh is a circle
	
	var mesh = [];

	var city_radius = 0.2;
	var city_points = 10;

	for(var i = 0; i < city_points; i++) {
	    var radians = 2 * Math.PI * (i / city_points);

	    mesh.push({
		x: city_radius * Math.cos(radians),
		y: city_radius * Math.sin(radians)
	    });
	};

	var circle = create_polygon(mesh);

	var selected = false;



	city.select = function () {
	    selected = true;
	};
	city.deselect = function () {
	    selected = false;
	};
	
	city.contains_point = function (point) {
	    return distance(this.position, point) < city_radius;
	};


	city.draw = function () {
	    
	    // technically this should ask if the camera sees any of the city, not just the center of the city
	    if(camera.sees_point(city.position)) {

		if(selected) {
		    context.strokeStyle = "#AA0000";
		} else {
		    context.strokeStyle = "#000000";
		}

		circle.draw(context, function (mesh_point) {
		    
		    var vertex = add_points(mesh_point, city.position);

		    return camera.units_to_pixels(vertex);
		});
	    }
	};

	city.build_miner = function () {
	};

	return city;
    };
    create_city.type = "city";

    
    var create_quarry = function (quarry_def) {

	var quarry = create_entity();
	quarry.types.push(create_quarry.type);

	quarry.position = quarry_def.position;
	quarry.miners = quarry_def.miners;


	var mesh = [];

	var quarry_radius = 0.2;
	var quarry_points = 3;

	for(var i = 0; i < quarry_points; i++) {
	    var radians = 2 * Math.PI * (i / quarry_points);

	    mesh.push({
		x: quarry_radius * Math.sin(radians),
		y: quarry_radius * -Math.cos(radians)
	    });
	};

	var triangle = create_polygon(mesh);

	quarry.draw = function () {
	    
	    // technically this should ask if the camera sees any of the city, not just the center of the city
	    if(camera.sees_point(quarry.position)) {

		context.strokeStyle = "#000000";

		triangle.draw(context, function (mesh_point) {
		    
		    var vertex = add_points(mesh_point, quarry.position);

		    return camera.units_to_pixels(vertex);
		});
	    }
	};

	return quarry;
    };
    create_quarry.type = "quarry";


    // initializes a game instance
    // returns an object with methods that modify the instance
    // must be started by calling .start() before it will run
    somerol.create_game = function () {

	var map_index = Math.floor(Math.random() * maps.length);
	var map = maps[map_index];

	var entities = [];

	var add_entity = function (entity) {
	    entities.push(entity);
	};

	var selected_entity;

	var game_loop;


	// add entities from map
	for(var i = 0; i < map.quarries.length; i++) {
	    
	    var quarry_def = map.quarries[i];
	    add_entity(create_quarry(quarry_def));
	}

	
	game = {};


	// runs a function on every entity in the world
	game.each_entity = function (func) {
	    for(var i = 0; i < entities.length; i++) {
		func(entities[i]);
	    }
	    
	    return game;
	};


	// adds the human player to the game
	// should be called at most once
	game.add_player = function () {
	    
	    // add initial city

	    var starting_location_index = Math.floor(Math.random() * map.starting_locations.length);
	    var starting_location = map.starting_locations[starting_location_index];

	    add_entity(create_city({
		x: starting_location.x,
		y: starting_location.y
	    }));

	    camera.position = {
		x: starting_location.x,
		y: starting_location.y
	    };

	    return game;
	};


	// selects entity
	game.select = function (entity) {

	    if(selected_entity) {
		selected_entity.deselect();
	    }
	    entity.select();

	    selected_entity = entity;

	    return game;
	};


	// redraws screen
	game.draw = function () {
	    context.clear();

	    for(var i = 0; i < entities.length; i++) {

		entities[i].draw();
	    }

	    return game;
	};


	// starts game
	game.start = function () {

	    var fps = 30;
	    var milliseconds = 1000 / fps;

	    game_loop = setInterval(function () {
		game.draw();
	    }, milliseconds);
	    
	    return game;
	};


	return game;
    };


    return somerol;
})();
