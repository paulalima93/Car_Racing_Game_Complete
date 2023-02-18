var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var car1, car2, cars, car1_img, car2_img, track_img;
var allPlayers;

var coinImage, fuelImage, obstacle1Image, obstacle2Image;
var lifeImage, blastImage;
var coins, fuels, obstacles

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track_img = loadImage("./assets/track.jpg");

  coinImage = loadImage("./assets/goldCoin.png");
  fuelImage = loadImage("./assets/fuel.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");

  lifeImage = loadImage("assets/life.png");
  blastImage = loadImage("assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
 database = firebase.database();
 console.log(database)
  game = new Game();
  game.getState();
  game.start();

  

}

function draw() {
  background(backgroundImage);

  if (playerCount === 2) {
    game.updateState(1);
  }

  if(gameState === 1){
    game.play();
  }

  if(gameState === 2){
    game.showLeaderboard();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
