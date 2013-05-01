/*
	Racing car example
	Silver Moon (m00n.silv3r@gmail.com)
*/

//Get the objects of Box2d Library
var b2Vec2 = Box2D.Common.Math.b2Vec2
	,  	b2AABB = Box2D.Collision.b2AABB
	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
	,	b2Body = Box2D.Dynamics.b2Body
	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	,	b2Fixture = Box2D.Dynamics.b2Fixture
	,	b2World = Box2D.Dynamics.b2World
	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	,  	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
	,  	b2Shape = Box2D.Collision.Shapes.b2Shape
	,	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	,	b2Joint = Box2D.Dynamics.Joints.b2Joint
	,	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
	;
         
var game = {
	
'key_down' : function(e)
{
var code = e.keyCode;

//left
if(code == 37){circ.x_force = -1;}
//up
if(code == 38){circ.y_force = 1;}
//right
if(code == 39){circ.x_force = 1;}
//down
if(code == 40){circ.y_force = -1;}
//car.start_engine();}

if(code == 32){
circ.fx = 1;
circ.fy = -1;

}// space fire


} ,

'key_up' : function(e)
{
var code = e.keyCode;

//stop forward velocity only when up or down key is released
if(code == 38 || code == 40){circ.y_force = 0;}
//LEFT OR RIGHT
if(code == 37 || code == 39){circ.x_force = 0;}
} ,
	
	'screen_width' : 0 ,
	'screen_height' : 0 ,
};

// var engine_speed = 0;
// var steering_angle = 0;
// var steer_speed = 1.0;
// var max_steer_angle = Math.PI/3;	//60 degrees to be precise
var world;
var ctx;
var canvas_height;

//1 metre of box2d length becomes 100 pixels on canvas
var scale = 100;

//The car object

var circ = {
'restitution' : 1.0 , 
'linearDamping' : 1.0 , 
'angularDamping' : 1.0 , 
'density' : 1.2, 
'x_force':0,
'y_force':0,
'fx':0,
'fy':0,
};




/*
	Draw a world
	this method is called in a loop to redraw the world
*/	 
function redraw_world(world, context) 
{
	//convert the canvas coordinate directions to cartesian
	ctx.save();
	ctx.translate(0 , canvas_height);
	ctx.scale(1 , -1);
	world.DrawDebugData();
	ctx.restore();
	}

//Create box2d world object
function createWorld() 
{
	var gravity = new b2Vec2(0, 0);
	var doSleep = true;
	
	world = new b2World(gravity , doSleep);
	
	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(scale);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	world.SetDebugDraw(debugDraw);
	
createBox(world , 
game.screen_width / 2 , 
0.5 , 
game.screen_width/2 - 1 , 
0.1 , 
{ 'type' : b2Body.b2_staticBody , 'restitution' : 0.5 }
);


createBox(world , 
game.screen_width -1  , 
game.screen_height / 2 , 
0.1 , 
game.screen_height/2 -1 , 
{ 'type' : b2Body.b2_staticBody , 'restitution' : 0.5 });
	
createPox(world,100,100,1,50);	

createShape(world,170,100,[
0,0,
5,10,
20,20,
30,2,

]);	

	

	
	//few lightweight boxes
 	var free = {'restitution' : 1.0 , 'linearDamping' : 1.0 , 'angularDamping' : 1.0 , 'density' : 0.2};
//	createBox(world , 2 , 2 , 0.5 , 0.5 , free);
// 	createBox(world , 5 , 2 , 0.5 , 0.5 , free);
	
	//createCircle(world, 2, 2,0.2, free);
	
	
	return world;
}		



function createPox(world, x, y, width, height, options) 
{
	 //default setting
	options = $.extend(true, {
		'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.5 ,
		
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_staticBody
	}, options);

	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	
	fix_def.shape = new b2PolygonShape();
	
	nw=width/scale;
	nh=height/scale;
	nx=x/scale;
	ny=y/scale;
 	nx=nx+(nw*1);
 	ny=ny+(nh*1);
	ny = game.screen_height-ny;

	fix_def.shape.SetAsBox( nw , nh );
	
	body_def.position.Set(nx , ny);

	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	
	body_def.type = options.type;
	
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);

	return b;
}

function createShape(world, x, y,cords,options) 
{
	 //default setting
	options = $.extend(true, {
	'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.5 ,
		
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_staticBody
	}, options);



	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	
	fix_def.shape = new b2PolygonShape();


console.log(fix_def);	
	
	
	

	

	nx=x/scale;
	ny=y/scale;

	ny = game.screen_height-ny;

//	fix_def.shape.SetAsBox( nw , nh );
	
	s=4/scale;
	  	
tt = new Array;
for (var i=0; i<cords.length; i=i+2) {
tt.push(new b2Vec2(s*cords[i], -1*(s*cords[i+1])));
}
fix_def.shape.SetAsArray(tt);


	
	body_def.position.Set(nx , ny);

	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	
	//body_def.type = options.type;
	
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);

	return b;
}




//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, options) 
{
	 //default setting
	options = $.extend(true, {
		'density' : 1.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.2 ,
		
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_dynamicBody
	}, options);
	
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	
	fix_def.shape = new b2PolygonShape();
	
	fix_def.shape.SetAsBox( width , height );
	
	body_def.position.Set(x , y);

	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	
	body_def.type = options.type;
	
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);

	return b;
}

//Create standard circle of given radius at x,y
function createCircle(world, x, y, radius, options) 
{
	 //default setting
	options = $.extend(true, {
		'density' : 5.0 ,
		'friction' : 0.0 ,
		'restitution' : 0.2 ,
		
		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,
		
		'gravityScale' : 1.0 ,
		'type' : b2Body.b2_dynamicBody
	}, options);
	
	var body_def = new b2BodyDef();
	var fix_def = new b2FixtureDef;
	
	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;
	
	fix_def.shape = new b2CircleShape(radius);
	body_def.position.Set(x , y);
	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
	body_def.type = options.type;
	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);
	
	return b;
}





















/*
	This method will draw the world again and again
	called by settimeout , self looped ,
	game_loop
*/
function game_loop() 
{
	var fps = 60;
	var time_step = 1.0/fps;
	

	update_circ();
	//move the world ahead , step ahead man!!
	world.Step(time_step , 8 , 3);
	//Clear the forces , Box2d 2.1a	
	world.ClearForces();
	
	//redraw the world
	redraw_world(world , ctx);
	
	//call this function again after 10 seconds
	setTimeout('game_loop()', 1000/60);
}


// main entry point
$(function() 
{
	game.ctx = ctx = $('#canvas').get(0).getContext('2d');
	var canvas = $('#canvas');
	
	game.canvas_width = canvas_width = parseInt(canvas.width());
	game.canvas_height = canvas_height = parseInt(canvas.height());
	
	game.screen_width = game.canvas_width / scale;
	game.screen_height = game.canvas_height / scale;
	
	//first create the world
	world = createWorld();
	

	create_circ();
	$(document).keydown(function(e)
	{
		game.key_down(e);
		return false;
	});
	
	$(document).keyup(function(e)
	{
		game.key_up(e);
		return false;
	});
	
	//Start the Game Loop!!!!!!!
	game_loop();
});



function create_circ(){
circ.body = createCircle(world, 2, 2,0.1);

// circ.body.ApplyForce({ x: 1.234, y: -1.234 }, circ.body.GetWorldCenter());
// console.log(circ.body);
}
//Method to update the car
function update_circ()
{
	//circ.body = createCircle(world, 2, 2,0.2);

circ.body.ApplyForce({ x: circ.x_force, y: circ.y_force }, circ.body.GetWorldCenter());

circ.body.ApplyImpulse({ x: circ.fx, y: circ.fy }, circ.body.GetWorldCenter());
circ.fx = 0;
circ.fy = 0;


}


function c(x){console.log(x);}


// $('#box').animate({  textIndent: 0 }, {
//     step: function(now,fx) {
//       $(this).css('-webkit-transform','rotate('+now+'deg)'); 
//     },
//     duration:'slow'
// },'linear');


// $('#foo').animate({  borderSpacing: -90 }, {
//     step: function(now,fx) {
//       $(this).css('-webkit-transform','rotate('+now+'deg)');
//       $(this).css('-moz-transform','rotate('+now+'deg)'); 
//       $(this).css('-ms-transform','rotate('+now+'deg)');
//       $(this).css('-o-transform','rotate('+now+'deg)');
//       $(this).css('transform','rotate('+now+'deg)');  
//     },
//     duration:'slow'
// },'linear');