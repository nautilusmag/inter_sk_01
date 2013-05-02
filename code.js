
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
var x = (Math.cos(theta) * 240)+250;
var y = (Math.sin(theta) * 240)+250;

ddy = y - 250;
ddx = (500-x) - 250;
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
	
//createPox(world,100,100,1,50);	

createShape(world,250,250,[
-3,-3,
5,10,
20,20,
30,2,

]);	
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
	nx=x/scale;
	ny=y/scale;
	ny = game.screen_height-ny;
	s=4/scale;
	  	
tt = new Array;
	for (var i=0; i<cords.length; i=i+2) {
		tt.push(new b2Vec2(s*cords[i], -1*(s*cords[i+1])));
	}
fix_def.shape.SetAsArray(tt);
	body_def.position.Set(nx , ny);
	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;
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



function game_loop() 
{
	var fps = 60;
	var time_step = 1.0/fps;
	rotcn();
	world.Step(time_step , 8 , 3);
	world.ClearForces();
	redraw_world(world , ctx);
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



function create_circ(x,y,dd){
console.log(dd);
circ.body = createCircle(world, x/scale, game.screen_height-(y/scale),0.1 ,{ 'density' : 5.0 });
pwr=2;
impulse = new b2Vec2(pwr*Math.cos(dd*Math.PI/180),pwr*Math.sin(dd*Math.PI/180));

circ.body.ApplyImpulse(impulse, circ.body.GetWorldCenter());
}



function c(x){console.log(x);}
var nw = 0;
var chng = 0;
function rotcn(){
nw=nw+chng;
nw = (nw<0)? nw=360+nw:nw;
nw = (nw>360)? nw=nw-360:nw;
		$('#cnnon').css('-webkit-transform','rotate('+nw+'deg)');
		$('#cnnon').css('-moz-transform','rotate('+nw+'deg)'); 
		$('#cnnon').css('-ms-transform','rotate('+nw+'deg)');
		$('#cnnon').css('-o-transform','rotate('+nw+'deg)');
		$('#cnnon').css('transform','rotate('+nw+'deg)');  
}


