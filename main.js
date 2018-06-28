/*
    Balloon Pop Game
    Tooty Ta Games
    https://tootytagames.com
    tootytagames@gmail.com
*/

// Screen width and height, initialised each time
// the start function is called
var screenWidth = 0; // window.innerWidth * window.devicePixelRatio;
var screenHeight = 0; // window.innerHeight * window.devicePixelRatio;

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() { 
        
        // This function will be executed at the beginning     
        // That's where we load the images and sounds

        // Load the balloon sprites
    	game.load.image('balloon1', 'assets/balloon1.png');
        game.load.image('balloon2', 'assets/balloon2.png');
        game.load.image('balloon3', 'assets/balloon3.png');
        game.load.image('balloon4', 'assets/balloon4.png');

    	// Add sound to game
    	game.load.audio('pop', 'assets/pop.wav');

        // Kids cheering
        game.load.audio('yay', 'assets/yay.wav');

        // sound track
        // game.load.audio('gummybearsong', 'assets/gummybearsong.wav');
    },

    create: function() {

        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.

        // Could use game.width and game.height...
        screenWidth = game.width;
        screenHeight = game.height;

        // If this is not a desktop (so it's a mobile device) 
        if (game.device.desktop == false) {
            
            // Set the scaling mode to SHOW_ALL to show all the game
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            // Set a minimum and maximum size for the game
            // Here the minimum is half the game size
            // And the maximum is the original game size
            game.scale.setMinMax(game.width/2, game.height/2, 
                game.width, game.height);

            // Center the game horizontally and vertically
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }

        // Change the background color of the game to white
    	game.stage.backgroundColor = '#ffffff';

    	// Set the physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	// Create an empty group
		this.balloons = game.add.group();

    	// Call the 'pop' function when the spacekey is hit
    	var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    
    	spaceKey.onDown.add(this.pop, this);

        // Call the 'jump' function when we tap/click on the screen
        game.input.onDown.add(this.pop, this);

    	this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", 
    		{ font: "30px Arial", fill: "#ff0000" });   

        this.popSound = game.add.audio('pop');
        this.cheeringSound = game.add.audio('yay');

        // May not need this, we'll see...
        this.balloonCounter = 0;

        // 
    	this.timer = game.time.events.loop(3500, this.addBalloons, this);
    },

    update: function() {
        
        // This function is called 60 times per second    
        // It contains the game's logic

        // If the bug is out of the screen (too high or too low)
    	// Call the 'restartGame' function
    },

    // Make the balloon go pop 
	pop: function(sprite, pointer) {
        
        // Update score and label
        this.score += 1;
        this.labelScore.text = this.score;

        if (this.score > 50 && this.score % 20 == 0)
            this.cheeringSound.play();

        // Pop sound
    	this.popSound.play();

        // Kill sprite...
        this.balloons.remove(sprite);
	},

	// Restart the game
	restartGame: function() {
    	
        // this.gummybearsong.stop();

    	// Start the 'main' state, which restarts the game
    	game.state.start('main');
	},

	addBalloon: function(x, y) {
    
    	// Create a balloon at the position x and y
        
        // Note: need to know which colour balloon to add
        // balloon1 .. balloon4

        // Randomly pick a number between 1 and 4
        // This will be the balloon to add
        var balloonColour = Math.floor(Math.random() * 4) + 1;

    	var balloon = game.add.sprite(x, y, 'balloon' + balloonColour);
        
        // Add input on sprite
        // Call click method when tapped, clicked, etc
        balloon.inputEnabled = true;
        balloon.events.onInputDown.add(this.pop, this);

    	// Add the balloon to our previously created group
    	this.balloons.add(balloon);

    	// Enable physics on the balloon
    	game.physics.arcade.enable(balloon);

    	// Add velocity to the balloon to make it move
    	balloon.body.velocity.y = 100;

    	// Automatically kill the balloon when it's no longer visible 
    	balloon.checkWorldBounds = true;
    	balloon.outOfBoundsKill = true;
	},

	addBalloons: function() {

    	// Add 10 balloons at x, y coords
        // Screen width and height global initialised
        // in start function

    	for (var i = 0; i < 10; i++) {
            
            // Make sure these positions don't overlap
            // unless using transparent backgrounds and maybe
            // z positions with CSS or upper layer with Phaser?

            // X between 0 and 20% of game.width
            var x = Math.floor(Math.random() * (game.width - 64)) + 1;
            // Y between 0 and 20% of game.height
            var y = Math.floor(Math.random() * (game.height - 64)) + 1;

            this.addBalloon(x, y);
        }

        // this.score += 1;
		// this.labelScore.text = this.score; 
	},

	hitPipe: function() {
    
    	// If the bug has already hit a pipe, do nothing
    	// It means the bug is already falling off the screen
    	if (this.bug.alive == false)
        	return;

    	// Set the alive property of the bug to false
    	this.bug.alive = false;

    	// Prevent new pipes from appearing
    	game.time.events.remove(this.timer);

    	// Go through all the pipes, and stop their movement
    	this.pipes.forEach(function(p){
        	p.body.velocity.x = 0;
    	}, this);

    	// Play chicken sound ... why chicken? lol
    	this.dieSound.play();

    	// Arrgh!

    	// Add no text so the message doesn't appear on top
    	// of the score

    	this.labelScore.text = "Dead bug!";
	}, 

};

// Initialize Phaser, and create a 400px by 490px game
// var game = new Phaser.Game(400, 490);

// Initialize Phaser, make it scale nicely, we hope.
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio, Phaser.CANVAS);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');
