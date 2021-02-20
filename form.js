class Form {

    constructor() {
      this.input = createInput("Type Name Here");
      this.button = createButton('Play');
      this.greeting = createElement('h2');
      this.title = createElement('h2');
      this.wait = createElement('h2');
    }

    hide(){
      this.greeting.hide();
      this.button.hide();
      this.input.hide();
      this.title.hide();
      this.wait.hide();
    }
  
    display(){
      this.title.html("Three Sided Sports");
      this.title.position(300, 0);
      this.title.style('font-size', '100px');
      this.title.style('color', 'blue');
      this.input.style('width', '400px');
      this.input.style('height', '40px');
      this.input.style('font-size', '30px');
      this.input.style('background', 'pink');
      this.button.style('width', '400px');
      this.button.style('font-size', '30px');
      this.button.style('height', '40px');
      this.button.style('background', 'pink');
      this.input.position(500 , 300);
      this.button.position(500, 350);
  
      this.button.mousePressed(()=>{
        this.input.hide();
        this.button.hide();
        player.name = this.input.value();
        playerCount+=1;
        player.index = playerCount;
        player.updateName();
        player.updateCount(playerCount);
        this.greeting.html("Hello " + player.name+"!");
        this.greeting.position(300, 300);
        this.greeting.style('font-size', '70px');
        this.greeting.style('color', 'blue');
        this.wait.html("Please wait for another player to join...");
        this.wait.position(300, 400);
        this.wait.style('font-size', '50px');
        this.wait.style('color', 'blue');
      });
  
    }
  }
  