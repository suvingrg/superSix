
game.match = function (cricket) {

    // variables declaration

    var ground, pitch,

        // wicket components
        wicket, leftStump, midStump, rightStump, bowl_stump,
        leftBell, rightBell, bell,

        // ball
        ball, drop, indicator, ballThrown = false,

        // variables for math calculation
        minX, minY, maxX, maxY,
        section,
        ball_drop_region,
        leftRect, midRect, rightRect,
        chosenRect,
        leftRectMinX, leftRectMaxX, leftRectMinY, leftRectMaxY,
        midRectMinX, midRectMaxX, midRectMinY, midRectMaxY,
        rightRectMinX, rightRectMaxX, rightRectMinY, rightRectMaxY,
        ballX, ballY,
        randomX, randomY, turnX, turnY,
        random_value,
        ball_velocity,
        shot_played,

        // bat and animations
        bat, straightShot, offShot, legShot,

        //buttons
        bowl_btn, straight_btn, off_btn, leg_btn;

};


game.match.prototype = {

    create: function () {

        // setting world bounds so that we can move the camera
        this.world.setBounds(0, 0, 640, 320);

        // ******************************************************************************************************
        // adding objects
        // ******************************************************************************************************

        // ******************************************************************************************************
        // ground
        // ******************************************************************************************************
        this.ground = this.add.tileSprite(0, 0, 640, 320, 'grass');
        this.ground.fixedToCamera = true;
        this.ground.alpha = 0.5;

        // ******************************************************************************************************
        // pitch
        // ******************************************************************************************************
        this.pitch = this.add.image(this.world.centerX, this.world.centerY + 80, 'pitch');
        this.pitch.anchor.setTo(0.5);
        this.pitch.scale.setTo(1, 0.9);

        // ******************************************************************************************************
        // math
        // ******************************************************************************************************

        this.minY = this.world.centerY - 24;
        this.maxY = this.world.centerY + 50;
        this.minX = this.world.centerX - 50;
        this.maxX = this.world.centerX + 30;

        this.section = (this.maxX - this.minX) / 3;

        // ball drop region - rectangle in front of the batter
        this.ball_drop_region = this.add.graphics(0, 0);
        this.ball_drop_region.beginFill('0x000', 0.7);
        this.ball_drop_region.drawRect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
        this.ball_drop_region.endFill();

        // left rect coordinates
        this.leftRectMinX = this.minX;
        this.leftRectMinY = 0;
        this.leftRectMaxX = (this.maxX - this.minX) / 3 + this.minX;
        this.leftRectMaxY = this.minY - 90;

        // drawing left rect
        this.leftRect = this.add.graphics(0, 0);
        this.leftRect.beginFill(0x000000, 0.7);
        this.leftRect.drawRect(this.leftRectMinX, this.leftRectMinY, this.leftRectMaxX - this.leftRectMinX, this.leftRectMaxY);
        this.leftRect.endFill();

        // mid rect coordinates
        this.midRectMinX = this.leftRectMaxX;
        this.midRectMinY = 0;
        this.midRectMaxX = this.leftRectMaxX + this.section;
        this.midRectMaxY = this.minY - 90;

        // drawing mid rect
        this.midRect = this.add.graphics(0, 0);
        this.midRect.beginFill(0x00ff00, 0.7);
        this.midRect.drawRect(this.midRectMinX, this.midRectMinY, this.midRectMaxX - this.midRectMinX, this.midRectMaxY);
        this.midRect.endFill();

        // right rect coordinates
        this.rightRectMinX = this.midRectMaxX;
        this.rightRectMinY = 0;
        this.rightRectMaxX = this.maxX;
        this.rightRectMaxY = this.minY - 90;

        // drawing right rect
        this.rightRect = this.add.graphics(0, 0);
        this.rightRect.beginFill(0xd0f0f0, 0.7);
        this.rightRect.drawRect(this.rightRectMinX, this.rightRectMinY, this.rightRectMaxX - this.rightRectMinX, this.rightRectMaxY);
        this.rightRect.endFill();

        // ball drop point
        this.drop = this.add.sprite(300, 10, 'bell');
        this.drop.scale.setTo(0.0001);

        // indicator point
        this.indicator = this.add.sprite(300, 10, 'bell');
        this.indicator.scale.setTo(0.001);

        // ******************************************************************************************************
        // wickets
        // ******************************************************************************************************

        // this.leftStump = this.add.sprite(this.minX + 37, this.minY - 02, 'stump');
        // this.leftStump.anchor.setTo(0.5);
        //
        // this.midStump = this.add.sprite(this.minX + 47, this.minY - 02, 'stump');
        // this.midStump.anchor.setTo(0.5);
        //
        // this.rightStump = this.add.sprite(this.minX + 57, this.minY - 02, 'stump');
        // this.rightStump.anchor.setTo(0.5);
        //
        // this.leftBell = this.add.sprite(this.minX + 39, this.minY - 55, 'bell');
        // this.leftBell.anchor.setTo(0.5, 0.5);
        //
        // this.rightBell = this.add.sprite(this.minX + 50, this.minY - 55, 'bell');
        // this.rightBell.anchor.setTo(0.5, 0.5);
        //
        //
        // this.stump = this.add.image(this.minX + 30, this.minY + 155, 'stump');
        // this.stump = this.add.image(this.minX + 42, this.minY + 155, 'stump');
        // this.stump = this.add.image(this.minX + 54, this.minY + 155, 'stump');
        //
        // this.bell = this.add.image(this.minX + 32, this.minY + 153, 'bell');
        // this.bell = this.add.image(this.minX + 45, this.minY + 153, 'bell');

        // ******************************************************************************************************
        // bat
        // ******************************************************************************************************

        this.bat = this.add.sprite(this.minX + 50, this.minY - 50, 'bat', 1);
        this.bat.anchor.setTo(0.5);
        this.physics.arcade.enable(this.bat);
        this.bat.body.immovable = true;

        // bat animations
        // straight shot
        this.straightShot = this.bat.animations.add('straight', [0, 1, 2, 3, 4, 5], 20);
        // off shot
        this.offShot = this.bat.animations.add('off', [0, 1, 2, 6, 7, 8, 9, 10], 20);
        // leg shot
        this.legShot = this.bat.animations.add('leg', [0, 1, 2, 11, 12, 13, 14, 15, 16, 17, 18], 25);

        // ******************************************************************************************************
        // buttons
        // ******************************************************************************************************

        bowl_btn = this.add.button(this.minX - 200, this.minY + 100, 'bowl_btn', this.bowling, this, 1, 0, 1, 0);

        straight_btn = this.add.button(this.minX + 260, this.minY + 100, 'straight_btn', this.straight_shot, this, 1, 0, 1, 0);

        off_btn = this.add.button(this.minX + 200, this.minY + 45, 'off_btn', this.off_shot, this, 1, 0, 1, 0);

        leg_btn = this.add.button(this.minX + 320, this.minY + 45, 'leg_btn', this.leg_shot, this, 1, 0, 1, 0);


        // enabling physics on objects
        // this.physics.arcade.enable([this.bat, this.drop, this.leftStump, this.midStump, this.rightStump, this.leftBell, this.rightBell]);
        this.physics.arcade.enable([this.drop]);

    },

    update: function () {

        // ball drop and velocity change
        if (this.physics.arcade.collide(this.ball, this.drop)) {

            this.chosenRect = this.chooseRect();
            if (this.chosenRect == 'left') {
                this.turnX = this.getRandomX(1);
                this.turnY = this.getRandomY(1);
                console.log(this.turnX, this.turnY);
            } else if (this.chosenRect == 'mid') {
                this.turnX = this.getRandomX(2);
                this.turnY = this.getRandomY(2);
                console.log(this.turnX, this.turnY);
            } else if (this.chosenRect == 'right') {
                this.turnX = this.getRandomX(3);
                this.turnY = this.getRandomY(3);
                console.log(this.turnX, this.turnY);
            }
            this.ball_velocity = Math.random() * (200 - 150) + 150;
            this.physics.arcade.moveToXY(this.ball, this.turnX, this.turnY, 100);
            console.log("ball_velocity = " + this.ball_velocity);
        }

        if (this.ballThrown === true) {
            this.checkHit();
        }


        //
        // if (this.physics.arcade.collide(this.ball, this.leftStump)) {
        //     this.ball.rotation = 0;
        //     this.ball.body.velocity = 0;
        //     this.leftStump.body.velocity = 0;
        //     this.midStump.body.velocity = 0;
        //     this.rightStump.body.velocity = 0;
        //     this.leftStump.rotation = -0.2;
        // } else if (this.physics.arcade.collide(this.ball, this.midStump) || cricket.physics.arcade.collide(this.ball, this.rightStump)) {
        //     this.ball.rotation = 0;
        //     this.ball.body.velocity = 0;
        //     this.leftStump.body.velocity = 0;
        //     this.midStump.body.velocity = 0;
        //     this.rightStump.body.velocity = 0;
        //     this.midStump.rotation = -0.1;
        //     this.rightStump.rotation = +0.2;
        // }
        //
        // if (this.physics.arcade.collide(this.leftStump, this.leftBell) || this.physics.arcade.collide(this.midStump, this.leftBell)) {
        //     this.leftBell.rotation = 1;
        //     this.cricket.physics.arcade.moveToXY(this.leftBell, 300, 0, 200);
        // } else if (this.physics.arcade.collide(this.midStump, this.rightBell) || this.physics.arcade.collide(this.rightStump, this.rightBell)) {
        //     this.rightBell.rotation = 1;
        //     this.cricket.physics.arcade.moveToXY(this.rightBell, 320, 0, 200);
        // }

    },

    render: function () {
        cricket.debug.spriteInfo(this.bat, 30, 30, '#fff');
        cricket.debug.spriteBounds(this.bat);
        cricket.debug.cameraInfo(this.camera, 30, 150, '#f00');
    },


    // custom functions

    //
    setBallPositionX: function () {

        this.ballX = Math.random() * (this.maxX - this.minX) + this.minX;
        return this.ballX;

    },

    //
    setBallPositionY: function () {

        this.ballY = Math.random() * (this.maxY - this.minY) + this.minY;
        return this.ballY;

    },

    // function for start bowling
    bowling: function () {

        this.randomX = this.setBallPositionX();
        this.randomY = this.setBallPositionY();

        this.drop.x = this.randomX;
        this.drop.y = this.randomY;
        this.indicator.x = this.randomX;
        this.indicator.y = this.randomY;

        // ball is added to game
        this.ball = this.add.sprite(this.world.centerX - 50, this.world.centerY + 130, 'ball');
        this.ball.anchor.setTo(0.5);
        this.ballThrown = true;

        this.physics.arcade.enable(this.ball);
        this.physics.arcade.moveToXY(this.ball, this.randomX, this.randomY, 70);

    },

    // function to play straight shot
    straight_shot: function () {
        this.straightShot.play();
        this.shot_played = 'straight';
    },

    // function to play off shot
    off_shot: function () {
        this.offShot.play();
        this.shot_played = 'off';
    },

    // function to play leg shot
    leg_shot: function () {
        this.legShot.play();
        this.shot_played = 'leg';
    },

    chooseRect: function () {
        this.random_value = Math.random();
        if (this.random_value <= 0.334) {
            return 'left';
        } else if (this.random_value > 0.334 && this.random_value <= 0.667) {
            return 'mid';
        } else {
            return 'right';
        }

    },

    getRandomX: function (value) {
        if (value == 1) {
            return Math.random() * (this.leftRectMaxX - this.leftRectMinX) + this.leftRectMinX;
        } else if (value == 2) {
            return Math.random() * (this.midRectMaxX - this.midRectMinX) + this.midRectMinX;
        } else if (value == 3) {
            return Math.random() * (this.rightRectMaxX - this.rightRectMinX) + this.rightRectMinX;
        }
    },

    getRandomY: function (value) {
        if (value == 1) {
            return Math.random() * (this.leftRectMaxY - this.leftRectMinY) + this.leftRectMinY;
        } else if (value == 2) {
            return Math.random() * (this.midRectMaxY - this.midRectMinY) + this.midRectMinY;
        } else if (value == 3) {
            return Math.random() * (this.rightRectMaxY - this.rightRectMinY) + this.rightRectMinY;
        }
    },

    checkHit: function ()
    {

        this.ball.rotation -= 1;

        if (this.physics.arcade.collide(this.bat, this.ball)) {

            if (this.shot_played == 'straight') {

                this.physics.arcade.moveToXY(this.ball, Math.random() * (420 - 220) + 220, 320, 700);
                console.log('straight');

            } else if (this.shot_played == 'off') {

                this.physics.arcade.moveToXY(this.ball, 0, Math.random() * (230 - 90) + 90, 700);
                console.log('off');

            } else if (this.shot_played == 'leg') {

                this.physics.arcade.moveToXY(this.ball, 640, Math.random() * (230 - 90) + 90, 700);
                console.log('leg');

            } else {

                this.ball.body.velocity = 0;

            }


        }


    }



};