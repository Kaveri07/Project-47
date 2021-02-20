class Player {
    constructor(){
      this.index = 0;
      this.name = null;
      this.distanceX = 0;
      this.distanceY = 0;
      this.score = 0;
    }
  
    getCount(){
      var playerCountRef = database.ref('playerCount');
      playerCountRef.on("value",(data)=>{
        playerCount = data.val();
      })
    }
  
    updateCount(count){
      database.ref('/').update({
        playerCount: count
      });
      this.index = playerCount;
    }
  
    updateName(){
      var playerIndex = "players/player" + this.index;
      database.ref(playerIndex).update({
        name:this.name,
        distanceX: this.distanceX,
        distanceY: this.distanceY,
        score: this.score
      });
    }
  
    static getPlayerInfo(){
      var playerInfoRef = database.ref('players');
      playerInfoRef.on("value",(data)=>{
        allPlayers = data.val();
      })
    }
  }