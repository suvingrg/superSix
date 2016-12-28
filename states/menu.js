
/**
 * menu state
 */
game.menu = function (cricket) {

    // variables declaration
    var menubg,
        board,
        play_btn;

};

game.menu.prototype = {

    create: function () {

        // background image
        this.menubg = this.add.image(0, 0, 'menubg');
        this.menubg.width = this.game.width;
        this.menubg.height = this.game.height;


        // board (title)
        this.board = this.add.sprite(this.world.width * 0.5, this.world.height * 0.5 - 47, 'board');
        this.board.anchor.setTo(0.5, 0.5);
        this.board.scale.setTo(0.25, 0.25);

        // blink animation
        this.board.animations.add('blink','', 3, true);
        this.board.animations.play('blink');


        // play button
        this.play_btn = cricket.add.button(this.world.width * 0.5, this.world.height * 0.5 + 70, 'play_btn', function () {
            
            // clearing up RAM
            this.freeUpMem();

            // calling select difficulty state
            this.state.start('select_difficulty');

        }, this, 1, 0, 1, 0);
        this.play_btn.scale.setTo(0.5, 0.5);
        this.play_btn.anchor.setTo(0.5, 0.5);


    },

    freeUpMem: function () {
        this.menubg.destroy();
        this.board.destroy();
        this.play_btn.destroy();
    }

};

/**
 * difficulty state
 */

game.select_difficulty = function (cricket) {
    
    var menubg, board, select_text,
        easy_btn, medium_btn, hard_btn;

}

game.select_difficulty.prototype = {

    create: function () {
        
        // background
        this.menubg = this.add.image(0, 0, 'menubg');
        this.menubg.width = this.game.width;
        this.menubg.height = this.game.height;

        // board and text
        this.board = this.add.image(this.world.centerX, this.world.centerY, 'scoreboard');
        this.board.anchor.setTo(0.5);
        this.board.scale.setTo(3, 1);
        this.select_text = this.add.bitmapText(this.world.centerX, this.world.centerY - 8, 'digital', 'SELECT DIFFICULTY');
        this.select_text.anchor.setTo(0.5);

        // buttons
        this.easy_btn = this.add.button(this.world.centerX - 200, this.world.centerY + 50, 'difficulty_btn', function () {
                game.difficulty = 'easy';
                this.startGame();
            },this, 1, 0, 1, 0);
        this.medium_btn = this.add.button(this.world.centerX - 50, this.world.centerY + 50, 'difficulty_btn', function () {
                game.difficulty = 'medium';
                this.startGame();
            },this, 3, 2, 3, 2);
        this.hard_btn = this.add.button(this.world.centerX + 100, this.world.centerY + 50, 'difficulty_btn', function () {
                game.difficulty = 'hard';
                this.startGame();
            },this, 5, 4, 5, 4);
        

    },

    startGame: function () {

        // clearing up RAM
        this.freeUpMem();

        // starting match
        this.state.start('match');

    },

    freeUpMem: function () {
        this.menubg.destroy();
        this.board.destroy();
        this.select_text.destroy();
        this.easy_btn.destroy();
        this.medium_btn.destroy();
        this.hard_btn.destroy();
    }    

}

