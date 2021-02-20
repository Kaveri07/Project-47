const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var gameState = "form";
var puckState = "play";
var playerCount, win1, win2, allPlayers, line, player1Ready, player2Ready, database, redPuck, bluePuck, gold, silver, form, player;
var game, name1, name2, endImage, introImage, hockeyTable, redPuckImage, bluePuckImage, puck, puckImage, players, edges, score1, score2;
var topRight, bottomRight, topLeft, bottomLeft, trackImage, boyImage, girlImage, right, left, person1, person2, persons, swimTrackImage;
var swimmer1Image, swimmer2Image, right2, left2, swimmer1, swimmer2, swimmers, obstacleRace, obstacleRaceGroup, rand, race1, race2, race3;
var race4, race5, obstacleSwim, obstacleSwimGroup, rand2, swim1, swim2, swim3, swim4, swim5, hockeyGoal, hockey, raceWin, hit, startImage;
var hockeyMusic, raceMusic, swimMusic;

function preload() {
  introImage = loadImage("intro.png");
  hockeyTable = loadImage("table.png");
  redPuckImage = loadImage("redPuck.png");
  bluePuckImage = loadImage("bluePuck.png");
  puckImage = loadImage("puck.png");
  trackImage = loadImage("track.jpg");
  boyImage = loadImage("boy.png");
  girlImage = loadImage("girl.png");
  swimTrackImage = loadImage("swimTrack.jpg");
  swimmer1Image = loadImage("swimmer1.png");
  swimmer2Image = loadImage("swimmer2.png");
  race1 = loadImage("mud.png");
  race2 = loadImage("mud2.png");
  race3 = loadImage("water.png");
  race4 = loadImage("water2.png");
  race5 = loadImage("ice.png");;
  swim1 = loadImage("fish.png");
  swim2 = loadImage("fish2.png");
  swim3 = loadImage("mud.png");
  swim4 = loadImage("mud2.png");
  swim5 = loadImage("fish3.png");
  endImage = loadImage("end.jpg");
  gold = loadImage("gold.png");
  silver = loadImage("silver.png");
  hockeyGoal = loadSound("hockeyGoals.mp3");
  hockey = loadSound("hockey.mp3");
  raceWin = loadSound("raceWin.mp3");
  hit = loadSound("hit.mp3");
  startImage = loadImage("start.jpg");
  hockeyMusic = loadSound("swimMusic.mp3");
  raceMusic = loadSound("raceMusic.mp3");
  startMusic = loadSound("startMusic.mp3");
  swimMusic = loadSound("swimMusic2.mp3");
}

function setup() {
  startMusic.play();
	createCanvas(1400, 800);

	engine = Engine.create();
	world = engine.world;

	Engine.run(engine);

	database = firebase.database();
	game = new Game();
  Player.getPlayerInfo();
  game.getState();
  game.start();

  obstacleRaceGroup = createGroup();
  obstacleSwimGroup = createGroup();
  
  redPuck = createSprite(200,400,100,100);
  redPuck.addImage(redPuckImage);
  redPuck.scale = 0.27;
  redPuck.visible = false;
  bluePuck = createSprite(1200,400,100,100);
  bluePuck.addImage(bluePuckImage);
  bluePuck.scale = 0.3;
  bluePuck.visible = false;
  players = [redPuck, bluePuck, puck];
  puck = createSprite(700,400,50,50);
  puck.addImage(puckImage);
  puck.scale = 0.1;
  puck.visible = false;
  line = createSprite(700,400,10,800);
  line.visible = false;
  var puckRefX = database.ref("puck/x")
      puckRefX.on("value", (data)=> {
        puck.x = data.val();
      })
  var puckRefY = database.ref("puck/y")
  puckRefY.on("value", (data)=> {
    puck.y = data.val();
  })

  var score1Ref = database.ref("players/player1/score")
  score1Ref.on("value", (data)=> {
    score1 = data.val();
  })
  var score2Ref = database.ref("players/player2/score")
  score2Ref.on("value", (data)=> {
    score2 = data.val();
  })

  var name1Ref = database.ref("players/player1/name")
  name1Ref.on("value", (data)=> {
    name1 = data.val();
  })
  var name2Ref = database.ref("players/player2/name")
  name2Ref.on("value", (data)=> {
    name2 = data.val();
  })

  var playerReady2Ref = database.ref("players/player2/ready")
  playerReady2Ref.on("value", (data)=> {
    player2Ready = data.val();
  })

  var playerReady1Ref = database.ref("players/player1/ready")
  playerReady1Ref.on("value", (data)=> {
    player1Ready = data.val();
  })

  var win1Ref = database.ref("players/player1/win");
  win1Ref.on("value", (data)=> {
    win1 = data.val();
  })
  var win2Ref = database.ref("players/player2/win");
  win2Ref.on("value", (data)=> {
    win2 = data.val();
  })

  topRight = createSprite(1400,107.5,10,215);
  topRight.visible = false;
  topLeft = createSprite(0,107.5,10,215);
  topLeft.visible = false;
  bottomLeft = createSprite(0,700,10,200);
  bottomLeft.visible = false;
  bottomRight = createSprite(1400,700,10,200);
  bottomRight.visible = false;
}


function draw() {
  rectMode(CENTER);
  background(startImage);
  edges = createEdgeSprites();
  //edges[0] = left
  //edges[1] = right
  //edges[2] = up
  //edges[3] = down

  console.log("1: "+win1);
  console.log("2: "+win2);

  if(playerCount === 2 && gameState === "form"){
    game.updateState("intro");
  }

  if(gameState === "intro"){
    form.hide();
    game.intro();
  }

  if(gameState === "hockey" || gameState === "hockeyEnd"){
    startMusic.stop();
    game.hockey();
    if(gameState === "hockeyEnd") {
      hockeyMusic.stop();
    }
  }

  if(gameState === "race" || gameState === "raceEnd"){
  	game.race();
  }

  if(gameState === "swim" || gameState === "swimEnd"){
  	game.swim();
  }

  if(gameState === "end"){
  	game.end();
  }

  if(keyDown("r")) {
    clear();
    game.updateState("form");
    player.updateCount(0);
    database.ref('players/player1').update({
      distanceX: 0,
      distanceY: 0,
      name: "",
      score: 0,
      ready: 0, 
      win: 0
    });
    database.ref('players/player2').update({
      distanceX: 0,
      distanceY: 0,
      name: "",
      score: 0,
      ready: 0,
      win: 0
    });
    database.ref('puck').update({
      x: 700,
      y: 400
    });
  }
  
  drawSprites();
}