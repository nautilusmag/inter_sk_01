
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
if(code == 37){chng = -1;}
//right
if(code == 39){chng = 1;}
//fire
if(code == 38){

// nw = (nw == 90)? 91:nw;
// nw = (nw == 270)? 271:nw;
var theta = (nw-90)*Math.PI/180;
var x = (Math.cos(theta) * 355)+365;
var y = (Math.sin(theta) * 355)+365;

ddy = y - 365;
ddx = (730-x) - 365;
ang = (Math.atan2(ddy,ddx) * 180 / Math.PI);
create_circ(x,y,ang);
}} ,

'key_up' : function(e)
{
var code = e.keyCode;
chng = 0;} ,
	'screen_width' : 0 ,
	'screen_height' : 0 ,
};

var world;
var ctx;
var canvas_height;
var nw = 0;
var chng = 0;
var pwr=0.7;
var rd = 0.08;
//1 metre of box2d length becomes 100 pixels on canvas
var scale = 100;

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


$(function() 
{
	game.ctx = ctx = $('#canvas').get(0).getContext('2d');
	var canvas = $('#canvas');
	game.canvas_width = canvas_width = parseInt(canvas.width());
	game.canvas_height = canvas_height = parseInt(canvas.height());
	game.screen_width = game.canvas_width / scale;
	game.screen_height = game.canvas_height / scale;
	world = createWorld();

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
