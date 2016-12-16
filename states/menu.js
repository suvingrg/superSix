
game.menu = function (cricket) {

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

        this.board.animations.add('blink','', 3, true);
        this.board.animations.play('blink');


        this.play_btn = cricket.add.button(this.world.width * 0.5, this.world.height * 0.5 + 70, 'play_btn', this.startGame, this, 1, 0, 1, 0);
        this.play_btn.scale.setTo(0.5, 0.5);
        this.play_btn.anchor.setTo(0.5, 0.5);


    },

    startGame: function () {

    }

};
