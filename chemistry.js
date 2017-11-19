/*Variables*/
var player = {
  radius: 5,
  xValue:30,
  yValue:30,
  xSpeed: 0,
  ySpeed: 0,
  speed: 0,
  increaseSpeed: false,
  energy: 1000,
};

var userInput = {//array of user input arrow keys
  pressed: [false, false, false, false],//[left, right, up, down]
};

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var interval = setInterval(update, 5);//updates the game screen every 5 milleseconds

/*Constructors*/
var Vector = function(x, y){
  this.x = x;
  this.y = y;
  this.magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));//sqrt(x^2 +y^2)
};
Vector.prototype.add = function(otherVector){
  return new Vector(this.x + otherVector.x, this.y + otherVector.y);
};
Vector.prototype.multiply = function(scalar) {
  return new Vector(this.x * scalar, this.y * scalar);
};

var enemy = function(x, y, radius, enemyColor, speed){
  this.xValue = x;
  this.yValue = y;
  this.radius = radius;
  this.enemyColor = enemyColor;
  this.speed = speed;
  this.speedVector;
  this.draw = function(){
    context.beginPath();
    context.arc(this.xValue, this.yValue, this.radius, 0, 2*Math.PI);
    context.fillStyle = enemyColor;
    context.fill();
    context.strokeStyle = "white";
    context.stroke();
  };
  this.clear = function(){
    context.beginPath();
    context.arc(this.xValue, this.yValue, this.radius + 1, 0, 2*Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.strokeStyle = "white";
    context.stroke();
  };
  this.calculateSpeedVector = function(){
    var vector = new Vector(player.xValue - this.xValue, player.yValue - this.yValue);
    if (vector.magnitude === 0){//magnitude can't be zero or else speed ratio will by NaN
      speedRatio = 0;
    }else{
      speedRatio = this.speed / vector.magnitude;
    }
    //ratio to scale vector down to speed vector
    this.speedVector = vector.multiply(speedRatio);
  };
  this.move = function(){
    this.xValue += this.speedVector.x;
    this.yValue += this.speedVector.y;
  }
};

var a = new enemy(0, 150, 15, "red", 0.9);
var b = new enemy(250, 200, 50, "red", 0.75);
var c = new enemy(200, 250, 5, "red", 0.95);

function setUp(){//draws the player circle
  context.beginPath();
  context.arc(player.xValue, player.yValue, player.radius, 0, 2*Math.PI);
  context.fillStyle = "black";
  context.fill();
  context.stroke();
}

function update(){
  clear();//clears previous circle
  detectCollisions();//detects collisions, also sees if player has died or not
  player.increaseSpeed = false;//automatically assume player is not moving to begin with
  updateTable();
  newPos();//finds position of new circle
  draw();//draws in the new circle at new position
}

function clear(){
  context.beginPath();
  context.arc(player.xValue, player.yValue, player.radius + 1, 0, 2*Math.PI);
  context.fillStyle = "white";//draws a white circle with a white border over previous circle
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function detectCollisions(){
  detectPlayerCollisions(a);
  detectPlayerCollisions(b);
  detectPlayerCollisions(c);
  
}

function detectPlayerCollisions(enemy){
  var distanceBetwCenters = Math.sqrt(Math.pow((player.xValue - enemy.xValue),2) + Math.pow((player.yValue - enemy.yValue),2));
  if (distanceBetwCenters < player.radius + enemy.radius){
    alert("gameOver!");
    clearInterval(interval);//clears interval that runs game
  }
}

function updateTable(){
  var tableEnergy = document.getElementById("energy");//finds table element containing energy and changes it
  tableEnergy.innerHTML = player.energy;
}

function newPos(){
  getUserInput();
  var speedVector = calculateSpeedVector();//introduces maximum speed
  player.xValue += speedVector.x;
  player.yValue += speedVector.y;
}

function getUserInput(){//checks which keys are held down
  for (i=0; i<userInput.pressed.length; i++){
    if (userInput.pressed[i] === true){
      player.increaseSpeed = true;//player is now going to move, base speed is increasing
      switch(i){
        case 0://right
          player.xSpeed += 0.05;
          break;
        case 1://left
          player.xSpeed -= 0.05;
          break;
        case 2://up
          player.ySpeed -= 0.05;
          break;
        case 3://down
          player.ySpeed += 0.05;//for some reason the y values actually start at top left
          break;
        default: return;
      }
    }else{
      switch(i){
        case 0://right
          player.xSpeed = player.xSpeed*0.9;
          break;
        case 1://left
          player.xSpeed = player.xSpeed*0.9;
          break;
        case 2://up
          player.ySpeed = player.ySpeed*0.9;
          break;
        case 3://down
          player.ySpeed = player.ySpeed*0.9;//for some reason the y values actually start at top left
          break;
        default: return;
      }
    }
  }
}

function calculateSpeedVector(){
  var playerInputVector = new Vector(player.xSpeed, player.ySpeed);//create vector using player Input
  if (player.increaseSpeed === true){
    player.speed = player.speed * 1.01 + 0.1;//player acceleration
    checkSpeed();
    player.energy -= 1;
  }else if (player.increaseSpeed === false){
    player.speed = player.speed * 0.995;//player decceleration, a little momentum
    checkSpeed();
  }
  var speedRatio;
  if (playerInputVector.magnitude === 0){//player magnitude can't be zero or else speed ratio will by NaN
    speedRatio = 0;
  }else{
    speedRatio = player.speed / playerInputVector.magnitude;
  }
  //ratio to scale vector down to speed vector
  var speedVector = playerInputVector.multiply(speedRatio);
  return speedVector;
}

function checkSpeed(){//introduces max speed so player doesn't go crazy fast
  if (player.speed >= 1){
    player.speed = 1;
  }
  else if (player.speed <= -1){
    player.speed = -1;
  }
}

function draw(){//draws the new ball
  context.beginPath();
  context.arc(player.xValue, player.yValue, player.radius, 0, 2*Math.PI);
  context.fillStyle = "black";
  context.fill();
  context.stroke();
  //a.clear();
  a.calculateSpeedVector();
  a.move();
  a.draw();
  //b.clear();
  b.calculateSpeedVector();
  b.move();
  b.draw();
  //c.clear();
  c.calculateSpeedVector();
  c.move();
  c.draw();
}

$(document).keydown(function(e) {//this tells when a key is pressed
  switch(e.keyCode) {
    case 39: // right
      userInput.pressed[0] = true;
      break;
    case 37: // left
      userInput.pressed[1] = true;
      break;
    case 38: // up
      userInput.pressed[2] = true;
      break;
    case 40: // down
      userInput.pressed[3] = true;
      break;
    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function(e) {//this tells when a key is released, sets keys pressed to false
  switch(e.keyCode) {
    case 39: // right
      userInput.pressed[0] = false;
      break;
    case 37: // left
      userInput.pressed[1] = false;
      break;
    case 38: // up
      userInput.pressed[2] = false;
      break;
    case 40: // down
      userInput.pressed[3] = false;
      break;
    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});