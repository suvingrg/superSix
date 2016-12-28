
game.preload = function (cricket) {

    // variables declaration
    var preloadBar;

};


game.preload.prototype = {

    preload: function () {

        // enabling phaser's physics engine
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // setting up loading screen
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);


        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

        // background
        this.load.image('menubg', 'assets/menubg.jpg');

        // font
        this.load.bitmapFont('digital', 'assets/font/digital.png', 'assets/font/digital.fnt');

        // objects
        this.load.image('grass', 'assets/grass.png');
        this.load.image('pitch', 'assets/pitch.png');
        this.load.image('stump', 'assets/stump.png');
        this.load.image('bell', 'assets/bell.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('stadium', 'assets/stadium.png');
        this.load.image('scoreboard', 'assets/scoreboard.png');
        this.load.image('score_box', 'assets/score_box.png');
        this.load.image('fielder', 'assets/fielder.png');

        // buttons
        this.load.spritesheet('play_btn', 'assets/play_btn.png', 167, 70, 2);
        this.load.spritesheet('difficulty_btn', 'assets/difficulty_btn.png', 100, 50, 6);
        this.load.spritesheet('bowl_btn', 'assets/bowl.png', 50, 50, 2);
        this.load.spritesheet('straight_btn', 'assets/straight_btn.png', 50, 50, 2);
        this.load.spritesheet('off_btn', 'assets/off_btn.png', 50, 50, 2);
        this.load.spritesheet('leg_btn', 'assets/leg_btn.png', 50, 50, 2);
        this.load.spritesheet('move_bat_btn', 'assets/move_bat_btn.png', 50, 50, 4);

        // animations
        // scoreboard
        this.load.spritesheet('board', 'assets/board.png', 1004, 687, 2);
        // bat and shot animations
        this.load.atlasJSONArray('bat', 'assets/bat.png', 'assets/bat.json');
        // bowler
        this.load.atlasJSONArray('bowler', 'assets/bowler.png', 'assets/bowler.json');
        this.load.atlasJSONArray('keeper', 'assets/keeper.png', 'assets/keeper.json');


        // debugging for fps
        this.time.advancedTiming = true;

    },

    create: function () {

        this.preloadBar.destroy();

        this.state.start('menu');

    }


};
