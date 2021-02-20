class Game {
    constructor(){
        this.introButton = createButton("Go to Air Hockey");
        this.introButton.hide();
    }
  
    getState(){
      var gameStateRef  = database.ref('gameState');
      gameStateRef.on("value",function(data){
         gameState = data.val();
      })
    }
  
    updateState(state){
      database.ref('/').update({
        gameState: state
      })
    }

    async start(){
        if(gameState === "form"){
          player = new Player();
          var playerCountRef = await database.ref('playerCount').once("value");
          if(playerCountRef.exists()){
            playerCount = playerCountRef.val();
            player.getCount();
          }
          form = new Form();
          form.display();
        }
    }

    intro() {
        background(introImage);
        this.introButton.show();
        this.introButton.style('width', '400px');
        this.introButton.style('height', '40px');
        this.introButton.style('background', 'pink');
        this.introButton.style('font-size', '30px');
        this.introButton.position(30, 600);
        this.introButton.mousePressed(()=>{
            this.introButton.hide();
            this.updateState("hockey");
            puck.velocityX = -10;
            puck.velocityY = -4;
            hockeyMusic.play();
            
        });
    }

    hockey() {
      background(hockeyTable);
      game.introButton.hide();
      form.wait.hide();
      form.greeting.hide();
      form.title.hide();
      Player.getPlayerInfo();

      textFont("georgia");
      fill(0);
      textSize(50);
      text(name1 +"'s Score: "+score1,10,50);
      text(name2 +"'s Score: "+score2,900,50);
      text("The first to 7 points wins!",10,750);

      bluePuck.visible = true;
      redPuck.visible = true;
      if(player.index === 1) {
          if(keyDown("up")) {
            player.distanceY +=20
            player.updateName();
          }
          if(keyDown("down") ) {
            player.distanceY -=20
            player.updateName();
          }
          if(keyDown("left")) {
              player.distanceX -=20;
              player.updateName();
          }
          if(keyDown("right")) {
              player.distanceX +=20;
              player.updateName();
          }
       
      } else if(player.index === 2) {
            if(keyDown("up")) {
              player.distanceY +=20
              player.updateName();
            }
            if(keyDown("down") ) {
              player.distanceY -=20
              player.updateName();
            }
            if(keyDown("left")) {
                player.distanceX -=20;
                player.updateName();
            }
            if(keyDown("right")) {
                player.distanceX +=20;
                player.updateName();
            }
      }
      
      if(puck.isTouching(edges[0]) && puck.y > 215 && puck.y < 600) {
        score2++;
        hockeyGoal.play();
        database.ref("players/player2").update({
          score: score2
        })
        database.ref("puck").update({
          x: 700,
          y: 400
        })
        puck.velocityX = 0;
        puck.velocityY = 0;
        puckState = "serve";
      
      }
      if(puck.isTouching(edges[1]) && puck.y > 215 && puck.y < 600) {
        score1++;
        hockeyGoal.play();
        database.ref("players/player1").update({
          score: score1
        })
        database.ref("puck").update({
          x: 700,
          y: 400
        })
        puck.velocityX = 0;
        puck.velocityY = 0;
        puckState = "serve";
      }

      if(puckState === "serve") {
        
        text("Press space to begin",750,750)
            if(keyDown("space")) {
              puck.velocityX = -10;
              puck.velocityY = -4;
              puckState = "play";
            }
      }

      var x = -200;
      var y;
      var x2;
      var index = 0;
      for(var plr in allPlayers) {
        index = index + 1;
        x = x + 600;
        y = 400 - allPlayers[plr].distanceY;
        x2 = x + allPlayers[plr].distanceX;
        players[index-1].x = x2;
        players[index-1].y = y;
      }
      
      database.ref("puck").update({
        x: puck.x,
        y: puck.y
      })
      puck.visible = true;
      puck.bounceOff(redPuck);
      puck.bounceOff(bluePuck);
      if(puck.bounceOff(redPuck)||puck.bounceOff(bluePuck)) {
        hockey.play();
      }
      if(puck.isTouching(topLeft)||puck.isTouching(bottomLeft)){
        puck.x = puck.x+50;
        puck.velocityY = puck.velocityY*(-1);
        puck.velocityX = puck.velocityX*(-1);
        hit.play();
      }
      if(puck.isTouching(topRight)||puck.isTouching(bottomRight)){
        puck.x = puck.x-50;
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
        hit.play();
      }
      if(puck.isTouching(edges[2])) {
        puck.y = puck.y+50
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
        hit.play();
      }
      if(puck.isTouching(edges[3])) {
        puck.y = puck.y-50
        puck.velocityY = puck.velocityY*(-1)
        puck.velocityX = puck.velocityX*(-1)
        hit.play();
      }
      if(player.index===1 && redPuck.isTouching(edges[0])) {
        player.distanceX = player.distanceX+20;
        hit.play();
      }
      if(player.index===1 && redPuck.isTouching(edges[1])) {
        player.distanceX = player.distanceX-20;
        hit.play();
      }
      if(player.index===1 && redPuck.isTouching(edges[2])) {
        player.distanceY = player.distanceY-20;
        hit.play();
      }
      if(player.index===1 && redPuck.isTouching(edges[3])) {
        player.distanceY = player.distanceY+20;
        hit.play();
      }
      if(player.index===2 && bluePuck.isTouching(edges[0])) {
        player.distanceX = player.distanceX+20;
        hit.play();
      }
      if(player.index===2 && bluePuck.isTouching(edges[1])) {
        player.distanceX = player.distanceX-20;
        hit.play();
      }
      if(player.index===2 && bluePuck.isTouching(edges[2])) {
        player.distanceY = player.distanceY-20;
        hit.play();
      }
      if(player.index===2 && bluePuck.isTouching(edges[3])) {
        player.distanceY = player.distanceY+20;
        hit.play();
      }
      if(player.index===1 && redPuck.isTouching(line)) {
        player.distanceX = player.distanceX-20;
        hit.play();
      }
      if(player.index===2 && bluePuck.isTouching(line)) {
        player.distanceX = player.distanceX+20;
        hit.play();
      }

      if(score1 === 7 || score2 === 7) {
        gameState = "hockeyEnd"
        game.updateState("hockeyEnd");
      }

      if(gameState === "hockeyEnd") {
        background(endImage);
        redPuck.visible = false;
        bluePuck.visible = false;
        puck.visible = false;
        puck.velocityY = 0;
        puck.velocityX = 0;
        textFont("georgia");
        fill(0);
        textSize(50);
        text("Press the right arrow key to proceed to the race.",20,425);
        if(score1 === 7) {
          text(name1 + " has won!!!",20,375);
          win1 = 1;
          database.ref("players/player1").update({
            win: win1
          })
        } else if(score2 === 7) {
          text(name2 + " has won!!!",20,375);
          win = 1;
          database.ref("players/player2").update({
            win: win2
          })
        } 
        if(player.index === 1) {
            if(player1Ready === 1){
              text("Wait for the other player...",20,325);
            } else if(player2Ready === 1){
              text("The other player is ready.",20,325);
            }
        } else if(player.index === 2) {
            if(player2Ready === 1){
              text("Wait for the other player...",20,325);
            } else if(player1Ready === 1){
              text("The other player is ready.",20,325);
            }
        }
        if(keyDown("right")) {
          if(player.index === 1) {
              database.ref('players/player1').update({
                ready: 1,
                distanceX: 0,
                distanceY: 0
              });
            }
          if(player.index === 2) {
              database.ref('players/player2').update({
                ready: 1,
                distanceX: 0,
                distanceY: 0
              });
          }
        }
      }

      if(player1Ready === 1 && player2Ready === 1) {
        game.updateState("race");
        hockeyMusic.stop();
        raceMusic.play();
      }

      right = createSprite(1300, 500, 30, 10000);
      right.visible = false;
      left = createSprite(100, 500, 30, 10000);
      left.visible = false;
      person1 = createSprite(100,200);
      person1.addImage(boyImage);
      person1.visible = false;
      person2 = createSprite(100,200);
      person2.addImage(girlImage);
      person2.visible = false;
      persons = [person1, person2];
    }

    race() {

    if(gameState === "race") {
      background("green");
      image(trackImage,0,-3700,1400,4500);
      this.introButton.hide();
      person1.visible = true;
      person2.visible = true;
      edges[2].visible = false;
      edges[3].visible = false;

      if(allPlayers !== undefined){
        var index = 0;
        var x = 190;
        var y;
        var x2;
        
        for(var plr in allPlayers){
          index = index + 1;
          x = x + 320;
          y = displayHeight - allPlayers[plr].distanceY;
          x2 = x + allPlayers[plr].distanceX;
          persons[index-1].x = x2;
          persons[index-1].y = y;
  
          if(persons[index-1].isTouching(left)) {
            persons.distanceX += 10;
          }
          if(persons[index-1].isTouching(right)) {
            player.distanceX -= 10;
          }
  
          if(index === player.index){
            fill("red");
            ellipse(x2, y, 60, 60);
            camera.position.x = 700;
            camera.position.y = persons[index-1].y
          }
  
          fill("white")
          textSize(15);
          textFont("georgia");
          textAlign(CENTER);
          text(allPlayers[plr].name, x2, y+150);
        }
      
      
      if(player.index !== null){
        if(person1.isTouching(obstacleRaceGroup) || person2.isTouching(obstacleRaceGroup)) {
          if(keyIsDown(UP_ARROW) ) {
            player.distanceY +=3
            player.updateName();
          }
          if(keyIsDown(LEFT_ARROW)) {
              player.distanceX -=3;
              player.updateName();
          }
          if(keyIsDown(RIGHT_ARROW)) {
              player.distanceX +=3;
              player.updateName();
          }
        } else {
            if(keyIsDown(UP_ARROW) ) {
              player.distanceY +=10
              player.updateName();
            }
            if(keyIsDown(LEFT_ARROW)) {
                player.distanceX -=10;
                player.updateName();
            }
            if(keyIsDown(RIGHT_ARROW)) {
                player.distanceX +=10;
                player.updateName();
            }
        }
      }
    }
      
      if(player.distanceY >= 4250) {
        player.score++;
        raceWin.play();
        player.updateName();
        if(score1 === 1) {
          win1 = win1 + 1;
          database.ref("players/player1").update({
            win: win1
          })
        } else if(score2 === 1) {
          win2 = win2 + 1;
          database.ref("players/player2").update({
            win: win2
          })
        } 
        gameState="raceEnd";
        game.updateState("raceEnd");
        camera.position.x = -700;
        camera.position.y = -400;
        
      }
      person1.bounceOff(person2);

      this.spawnRaceObstacles();
    }

      if(gameState === "raceEnd") {
        background(endImage);
        raceMusic.stop();
        camera.position.x = -700;
        camera.position.y = -400;
        person1.visible = false;
        person2.visible = false;
        left.visible = false;
        right.visible = false;
        textFont("georgia");
        fill(0);
        textSize(50);
        text("Press the right arrow key to proceed to the swimming race.",camera.position.x-650,camera.position.y-250);
        if(score1 === 1) {
          text(name1 + " has won!!!",camera.position.x-650,camera.position.y-300);
        } else if(score2 === 1) {
          text(name2 + " has won!!!",camera.position.x-650,camera.position.y-300);
        } 
        if(player.index === 1) {
          if(player1Ready === 2){
            text("Wait for the other player...",camera.position.x-650,camera.position.y-350);
          } else if(player2Ready === 2){
            text("The other player is ready.",camera.position.x-650,camera.position.y-350);
          }
        } else if(player.index === 2) {
            if(player2Ready === 2){
              text("Wait for the other player...",camera.position.x-650,camera.position.y-350);
            } else if(player1Ready === 2){
              text("The other player is ready.",camera.position.x-650,camera.position.y-350);
            }
        }

        if(keyWentDown("right")) {
          if(player.index === 1) {
              player.distanceY = 0;
              database.ref('players/player1').update({
                ready: 2,
                distanceX: 0,
                distanceY: 0,
                score: 0
              });
              text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
          }
          if(player.index === 2) {
              player.distanceY = 0;
              database.ref('players/player2').update({
                ready: 2,
                distanceX: 0,
                distanceY: 0,
                score: 0
              });
              text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
          }
        }
        right2 = createSprite(1300, 500, 30, 10000);
        right2.visible = false;
        left2 = createSprite(100, 500, 30, 10000);
        left2.visible = false;
        swimmer1 = createSprite(100,200);
        swimmer1.addImage(swimmer1Image);
        swimmer1.scale = 1.5;
        swimmer1.visible = false;
        swimmer2 = createSprite(100,200);
        swimmer2.addImage(swimmer2Image);
        swimmer2.scale = 1.5;
        swimmer2.visible = false;
        swimmers = [swimmer1, swimmer2];

      if(player1Ready === 2 && player2Ready === 2) {
        swimMusic.play();
        raceMusic.stop();
        database.ref("players/player1").update({
          score: 0
        })
        database.ref("players/player2").update({
          score: 0
        })
        game.updateState("swim");
        gameState = "swim";
      }

    }
  }

  swim() {
    if(gameState === "swim") {
      background("blue");
      image(swimTrackImage,0,-3700,1400,4500);

      obstacleRaceGroup.destroyEach();

      swimmer2.visible = true;
      swimmer1.visible = true;
      edges[2].visible = false;
      edges[3].visible = false;

      if(allPlayers !== undefined){
        var index = 0;
        var x = 190;
        var y;
        var x2;
        
        for(var plr in allPlayers){
          index = index + 1;
          x = x + 320;
          y = displayHeight - allPlayers[plr].distanceY;
          x2 = x + allPlayers[plr].distanceX;
          swimmers[index-1].x = x2;
          swimmers[index-1].y = y;
  
          if(swimmers[index-1].isTouching(left)) {
            persons.distanceX += 10;
          }
          if(swimmers[index-1].isTouching(right)) {
            player.distanceX -= 10;
          }
  
          if(index === player.index){
            fill("red");
            ellipse(x2, y, 60, 60);
            camera.position.x = 700;
            camera.position.y = swimmers[index-1].y
          }
  
          fill("white")
          textSize(15);
          textFont("georgia");
          textAlign(CENTER);
          text(allPlayers[plr].name, x2, y+150);
        }
  
        if(player.index !== null){
          if(swimmer1.isTouching(obstacleSwimGroup) || swimmer2.isTouching(obstacleSwimGroup)) {
            if(keyIsDown(UP_ARROW) ) {
              player.distanceY +=3
              player.updateName();
            }
            if(keyIsDown(LEFT_ARROW)) {
                player.distanceX -=3;
                player.updateName();
            }
            if(keyIsDown(RIGHT_ARROW)) {
                player.distanceX +=3;
                player.updateName();
            }
          } else {
              if(keyIsDown(UP_ARROW) ) {
                player.distanceY +=10
                player.updateName();
              }
              if(keyIsDown(LEFT_ARROW)) {
                  player.distanceX -=10;
                  player.updateName();
              }
              if(keyIsDown(RIGHT_ARROW)) {
                  player.distanceX +=10;
                  player.updateName();
              }
          }
        }
    }
      
      if(player.distanceY >= 4550) {
        player.score++;
        player.updateName();
        if(score1 === 1) {
          win1 = win1 + 1;
          database.ref("players/player1").update({
            win: win1
          })
        } else if(score2 === 1) {
          win2 = win2 + 1;
          database.ref("players/player2").update({
            win: win2
          })
        } else if(score1 === 2) {
          win2 = win2 + 1;
          database.ref("players/player2").update({
            win: win2
          })
        } else if(score2 === 2) {
          win2 = win2 + 1;
          database.ref("players/player2").update({
            win: win2
          })
        }
        gameState="swimEnd";
        game.updateState("swimEnd");
        camera.position.x = -700;
        camera.position.y = -400;
      }
      swimmer1.bounceOff(swimmer2);

      this.spawnSwimObstacles();
    }
  
    if(gameState === "swimEnd") {
      swimMusic.stop();
      obstacleSwimGroup.destroyEach();
      camera.position.x = -700;
      camera.position.y = -400;
      background(endImage);
      swimmer1.visible = false;
      swimmer2.visible = false;
      textFont("georgia");
      fill(0);
      textSize(50);
      text("Press the right arrow key to proceed to the end results.",camera.position.x-650,camera.position.y-250);
        if(score1 === 1) {
          text(name1 + " has won!!!",camera.position.x-650,camera.position.y-300);
        } else if(score2 === 1) {
          text(name2 + " has won!!!",camera.position.x-650,camera.position.y-300);
        } 
        if(player.index === 1) {
          if(player1Ready === 3){
            text("Wait for the other player...",camera.position.x-650,camera.position.y-350);
          } else if(player2Ready === 3){
            text("The other player is ready.",camera.position.x-650,camera.position.y-350);
          }
        } else if(player.index === 2) {
            if(player2Ready === 3){
              text("Wait for the other player...",camera.position.x-650,camera.position.y-350);
            } else if(player1Ready === 3){
              text("The other player is ready.",camera.position.x-650,camera.position.y-350);
            }
        }

      if(keyWentDown("right")) {
        if(player.index === 1) {
            database.ref('players/player1').update({
              ready: 3,
              distanceX: 0,
              distanceY: 0,
              score: 0
            });
            text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
        }
        if(player.index === 2) {
            database.ref('players/player2').update({
              ready: 3,
              distanceX: 0,
              distanceY: 0,
              score: 0
            });
            text("Wait for the other player...",camera.position.x-650,camera.position.y-250);
        }
      }
    

    if(player1Ready === 3 && player2Ready === 3) {
      game.updateState("end");
      gameState = "end";
      raceWin.play();
    }
  }
}

  end() {
    clear();
    swimMusic.stop();
    background(endImage);
    camera.position.x = -1000;
    camera.position.y = 400;
    push();
    imageMode(CENTER);
    image(gold, -1150, 400, 350, 700);
    image(silver, -1500, 400, 350, 600);
    pop();
    textSize(50);
    textFont("georgia");
    fill(0);
    if(win1 >= 2) {
      text(name1 + " has won the gold medal!",-1000,350);
      text(name2 + " has won the silver medal!",-1000,250);
      text(name1,-1220,570);
      text(name2,-1560,540);
    } else if (win2 >= 2) {
      text(name2 + " has won the gold medal!",-1000,350);
      text(name1 + " has won the silver medal!",-1000,250);
      text(name2,-1220,570);
      text(name1,-1560,540);
    }
  }

  spawnRaceObstacles() {
    if(frameCount%20===0) {
      if(player.index === 1) {
        obstacleRace = createSprite(random(person1.x-150,person1.x+150),person1.y - 500,100,20);  
      } else if (player.index === 2) {
        obstacleRace = createSprite(random(person2.x-150,person2.x+150),person2.y - 500,100,20);
      }
      rand = Math.round(random(1,5))
      if(rand===1) {
        obstacleRace.addImage(race5);
        obstacleRace.scale = 0.25;
      } else if (rand===2) {
        obstacleRace.addImage(race1);
        obstacleRace.scale = 0.25;
      } else if (rand===3) {
        obstacleRace.addImage(race2);
        obstacleRace.scale = 0.25;
      } else if (rand===4) {
        obstacleRace.addImage(race3);
        obstacleRace.scale = 0.25;
      } else if (rand===5) {
        obstacleRace.addImage(race4);
        obstacleRace.scale = 0.25;
      }
      obstacleRace.lifetime = 10000;
      obstacleRaceGroup.add(obstacleRace);
    }
  
  }

  spawnSwimObstacles() {
    if(frameCount%20===0) {
      if(player.index === 1) {
        obstacleSwim = createSprite(random(swimmer1.x-150,swimmer1.x+150),swimmer1.y - 500,100,20);  
      } else if (player.index === 2) {
        obstacleSwim = createSprite(random(swimmer2.x-150,swimmer2.x+150),swimmer2.y - 500,100,20);
      }
      rand2 = Math.round(random(1,5))
      if(rand2===1) {
        obstacleSwim.addImage(swim5);
        obstacleSwim.scale = 0.25;
      } else if (rand2===2) {
        obstacleSwim.addImage(swim1);
        obstacleSwim.scale = 0.25;
      } else if (rand2===3) {
        obstacleSwim.addImage(swim2);
        obstacleSwim.scale = 0.25;
      } else if (rand2===4) {
        obstacleSwim.addImage(swim3);
        obstacleSwim.scale = 0.25;
      } else if (rand2===5) {
        obstacleSwim.addImage(swim4);
        obstacleSwim.scale = 0.25;
      }
      obstacleSwim.lifetime = 10000;
      obstacleSwimGroup.add(obstacleSwim);
    }
  }
}