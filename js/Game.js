class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.isMoving = false;
    this.leftDirection = false;
    this.isDead = false;
    this.isGameOver = false;
  }

  handleElements(){

  
    this.resetTitle.html("Reiniciar Jogo");
    this.resetTitle.position(width/2 + 200, 40);
    this.resetTitle.class("resetText");

    this.resetButton.position(width/2 + 200, 100);
    this.resetButton.class("resetButton");

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

  }

  handleResetButton(){
    this.resetButton.mousePressed(()=> {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0

      });
      window.location.reload();
    })
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

    car1 = createSprite(width/2 -100, height-100);
    car1.addImage("car1", car1_img);
    car1.addImage("blast", blastImage);
    car1.scale = 0.07;

    car2 = createSprite(width/2 +100, height-100);
    car2.addImage("car2", car2_img);
    car2.addImage("blast", blastImage);
    car2.scale = 0.07;

      //     0      1
    cars = [car1, car2];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    
    this.addSprites(fuels, 6, fuelImage, 0.02);
    this.addSprites(coins, 20, coinImage, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (let i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image
      } else {
        x = random(width/2 + 150, width/2 - 150);
        y = random(-height * 4.5, height-400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }


  play(){

    form.hide();
    this.handleElements();
    this.handleResetButton();
    
    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      image(track_img, 0, -height*5, width, height*6);

      this.showLeaderboard();
      this.showFuel();
      this.showLife();
      
      var index = 0;
      for (var plr in allPlayers) {
        index += 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentLife = allPlayers[plr].life;
        if (currentLife <= 0) {
          cars[index-1].changeImage("blast");
          cars[index-1].scale = 0.3;
         
          
        }


        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if (index === player.index) {
          fill("red");
          ellipse(x, y, 60,60);
          this.handleCoins(index);
          this.handleFuel(index);
          this.handleObstacleCollision(index);
          this.handleCarCollision(index);

          if (player.life <=0) {
            this.isDead = true;
            this.isMoving = false;

            if(!this.isGameOver){
            
              this.gameOver();
              this.isGameOver=true;
            }
          }
          camera.position.y = cars[index-1].position.y;
        }
      }


      const finishLine = height * 6 - 100;

      if(player.positionY > finishLine){
        gameState = 2;
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      this.handlePlayerControl();
      drawSprites();
    }

  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }

  updateState(state){
    database.ref("/").update({
      gameState: state
    })
  }

  handlePlayerControl(){
    if (!this.isDead) {
      if (keyIsDown(UP_ARROW)) {
        this.isMoving = true;
        player.positionY +=10;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width/3 - 50) {
        this.leftDirection = true;
        player.positionX -=10;
        player.update();
      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width/2 + 300) {
        this.leftDirection = false;
        player.positionX +=10;
        player.update();
      }
    }
  }

  handleFuel(index){
    cars[index-1].overlap(fuels, function(collector, collected){
      player.fuel = 185;
      collected.remove();
    })

    if (player.fuel > 0 && this.isMoving) {
      player.fuel -= 0.2;
    }

    if(player.fuel <= 0){
      gameState = 2;
      this.gameOver();
    }

  }

  handleCoins(index){
    cars[index-1].overlap(coins, function(collector, collected){
      player.score += 10;
      player.update();
      collected.remove();
    })
  }

  handleObstacleCollision(index){
    if(cars[index-1].collide(obstacles)){
      if (this.leftDirection) {
        player.positionX +=100;
      } else {
        player.positionX -=100;
      }

      if(player.life > 0){
        player.life -= 185/4;
      }
      player.update();
    }
  }

  handleCarCollision(index){
    if (index === 1) {
      if(cars[index-1].collide(cars[1])){
        if (this.leftDirection) {
          player.positionX +=100;
        } else {
          player.positionX -=100;
        }
  
        if(player.life > 0){
          player.life -= 185/4;
        }
        player.update();
      }
    }

    if (index === 2) {
      if(cars[index-1].collide(cars[0])){
        if (this.leftDirection) {
          player.positionX +=100;
        } else {
          player.positionX -=100;
        }
  
        if(player.life > 0){
          player.life -= 185/4;
        }
        player.update();
      }
    }
  }

  showFuel(){
    push();
    image(fuelImage, width/2-70, height - player.positionY - 350, 20,20);
    fill("white");
    rect(width/2 , height - player.positionY - 350, 185, 20);
    fill("gold");
    rect(width/2 , height - player.positionY - 350, player.fuel, 20);
    pop();
  }

  showLife(){
    push();
    image(lifeImage, width/2-70, height - player.positionY - 400, 20,20);
    fill("white");
    rect(width/2 , height - player.positionY - 400, 185, 20);
    fill("tomato");
    rect(width/2 , height - player.positionY - 400, player.life, 20);
    pop();
  }

  gameOver(){
    console.log("Acabou !!!");

    swal({
      title: "Fim de Jogo!",
      text: "Opa! Você perdeu 💔 ",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Tente Novamente!"
    })
  }

  showRank(){
    console.log("Venci !!!");

    swal({
      title: ` Incrivel! ${"\n"} ${player.rank}º lugar!`,
      text: "Você alcançou a linha de chegada 🤩 ",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigada por jogar!"
    })
  }

}
