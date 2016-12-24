
game.match = function (cricket) {

    // variables declaration

    var ground, pitch,

        // wicket components
        wicket, leftStump, midStump, rightStump, bowl_stump,
        leftBell, rightBell, bell,

        // ball
        ball, drop, ballThrown,

        // variables for math calculation
        minX, minY, maxX, maxY,
        section,
        ball_drop_region,
        leftRect, midRect, rightRect,
        chosenRect,
        leftRectMinX, leftRectMaxX, leftRectMinY, leftRectMaxY,
        midRectMinX, midRectMaxX, midRectMinY, midRectMaxY,
        rightRectMinX, rightRectMaxX, rightRectMinY, rightRectMaxY,
        
        // bowling
        ballX, ballY,
        randomX, randomY, turnX, turnY,
        random_value,
        ball_velocity,
        shot_played, ball_hit,

        // scoring
        stadium, hit_ball, hit_ball_velocity, hit_ball_point, hit_ball_shot, hit_ball_destination,

        // scoring animations
        scoreboard, run_text, run_text_score, run_scored,

        // bat and animations
        bat, straightShot, offShot, legShot,

        // scores
        score_box_group,
        score_box, player_text,
        total_runs, total_runs_text,
        fallen_wickets,
        overs_left, overs_left_text,
        target_runs, target_runs_text,
        font_style,

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

        this.bowl_btn = this.add.button(this.minX - 200, this.minY + 100, 'bowl_btn', this.bowling, this, 1, 0, 1, 0);

        this.straight_btn = this.add.button(this.minX + 260, this.minY + 100, 'straight_btn', this.straight_shot, this, 1, 0, 1, 0);

        this.off_btn = this.add.button(this.minX + 200, this.minY + 45, 'off_btn', this.off_shot, this, 1, 0, 1, 0);

        this.leg_btn = this.add.button(this.minX + 320, this.minY + 45, 'leg_btn', this.leg_shot, this, 1, 0, 1, 0);


        // enabling physics on objects
        // this.physics.arcade.enable([this.drop, this.leftStump, this.midStump, this.rightStump, this.leftBell, this.rightBell]);
        this.physics.arcade.enable([this.drop]);



        // ******************************************************************************************************
        // scoring
        // ******************************************************************************************************
        
        // stadium - for showing the ball trajectory after being hit by the bat
        this.stadium = this.add.image(this.world.centerX, this.world.centerY, 'stadium');
        this.stadium.anchor.setTo(0.5);
        this.stadium.scale.setTo(1.5, 1);
        this.stadium.visible = false;

        // score box group
        this.score_box_group = this.add.group();

        // score box image
        this.score_box = this.add.image(5, 5, 'score_box');
        this.score_box.scale.setTo(3, 2);
        this.score_box_group.add(this.score_box);

        // intializing the random target_runs 
        this.target_runs = Math.floor(Math.random() * (150 - 100 + 1)) + 100;
        this.total_runs = 0;
        this.fallen_wickets = 0;
        this.overs_left = 36;
        this.font_style = {font: '17px Arial', fill: '#ffffff', align: 'left'};

        // score box text
        this.player_text = this.add.text(14, 8, 'YOU', this.font_style, this.score_box_group);
        this.total_runs_text = this.add.text(74, 8, this.total_runs + ' - ' + this.fallen_wickets, this.font_style, this.score_box_group);
        this.overs_left_text = this.add.text(14, 32, 'BALLS LEFT - ' + this.overs_left, this.font_style, this.score_box_group);
        this.target_runs_text = this.add.text(14, 56, 'TARGET - ' + this.target_runs, this.font_style, this.score_box_group);

        

    },

    update: function () {

        // ball drop and velocity change
        if (this.physics.arcade.collide(this.ball, this.drop)) {

            this.chooseRect();

            this.turnX = this.getRandomX();
            this.turnY = this.getRandomY();

            this.ball_velocity = Math.random() * (270 - 170) + 170;
            this.physics.arcade.moveToXY(this.ball, this.turnX, this.turnY, this.ball_velocity);
            // console.log("ball_velocity = " + this.ball_velocity);
        }

        if (this.ballThrown === true) {

            this.checkHit();

            if (this.ball_hit === true) {

                if (!this.ball.inCamera) {

                    this.ball.destroy();
                    this.stadium.visible = true;

                    this.hit_ball = this.add.sprite(this.world.centerX - 7, this.world.centerY - 25, 'ball');
                    this.hit_ball.anchor.setTo(0.5);
                    this.hit_ball_destination = this.add.sprite(0, 0, 'bell');
                    this.hit_ball_destination.scale.setTo(0.0001);
                    this.hit_ball_destination.anchor.setTo(0.5);
                    this.physics.arcade.enable([this.hit_ball, this.hit_ball_destination]);

                    // this.hit_ball_velocity = 610;
                    console.log('hit_ball_velocity = ' + this.hit_ball_velocity);

                    if (this.hit_ball_shot == 'straight') {


                        if (this.hit_ball_velocity >= 500 && this.hit_ball_velocity < 580) {

                            this.hit_ball_destination.x = this.hit_ball_point;
                            this.hit_ball_destination.y = this.world.centerY + 60;
                            this.physics.arcade.moveToXY(this.hit_ball, this.hit_ball_point, this.world.centerY + 60, 50);
                            this.run_scored = 1;

                        } else if (this.hit_ball_velocity >= 580 && this.hit_ball_velocity < 640) {

                            this.hit_ball_destination.x = this.hit_ball_point;
                            this.hit_ball_destination.y = this.world.centerY + 120;
                            this.physics.arcade.moveToXY(this.hit_ball, this.hit_ball_point, this.world.centerY + 120, 60);
                            this.run_scored = 2;
                            

                        } else if (this.hit_ball_velocity >= 640 && this.hit_ball_velocity < 700) {

                            this.hit_ball_destination.x = this.hit_ball_point;
                            this.hit_ball_destination.y = 320;
                            this.physics.arcade.moveToXY(this.hit_ball, this.hit_ball_point, 320, 150);
                            this.run_scored = 4;

                        }


                    } else if (this.hit_ball_shot == 'off') {

                        if (this.hit_ball_velocity >= 500 && this.hit_ball_velocity < 560) {

                            this.hit_ball_destination.x = this.world.centerX - 60;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX - 60, this.hit_ball_point, 50);
                            this.run_scored = 1;

                        } else if (this.hit_ball_velocity >= 560 && this.hit_ball_velocity < 630) {

                            this.hit_ball_destination.x = this.world.centerX - 120;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX - 120, this.hit_ball_point, 60);
                            this.run_scored = 2;

                        } else if (this.hit_ball_velocity >= 630 && this.hit_ball_velocity < 640) {

                            this.hit_ball_destination.x = this.world.centerX - 150;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX - 150, this.hit_ball_point, 70);
                            this.run_scored = 3;

                        } else if (this.hit_ball_velocity >= 640 && this.hit_ball_velocity < 680) {

                            this.hit_ball_destination.x = this.world.centerX - 260;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX - 260, this.hit_ball_point, 200);
                            this.run_scored = 4;

                        } else if (this.hit_ball_velocity >= 680 && this.hit_ball_velocity < 700) {

                            this.hit_ball_destination.x = 0;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, 0, this.hit_ball_point, 400);
                            this.run_scored = 6;

                        }


                    } else if (this.hit_ball_shot == 'leg') {


                        if (this.hit_ball_velocity >= 500 && this.hit_ball_velocity < 560) {

                            this.hit_ball_destination.x = this.world.centerX + 60;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX + 60, this.hit_ball_point, 50);
                            this.run_scored = 1;

                        } else if (this.hit_ball_velocity >= 560 && this.hit_ball_velocity < 630) {

                            this.hit_ball_destination.x = this.world.centerX + 120;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX + 120, this.hit_ball_point, 60);
                            this.run_scored = 2;

                        } else if (this.hit_ball_velocity >= 630 && this.hit_ball_velocity < 640) {

                            this.hit_ball_destination.x = this.world.centerX + 150;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX + 150, this.hit_ball_point, 70);
                            this.run_scored = 3;

                        } else if (this.hit_ball_velocity >= 640 && this.hit_ball_velocity < 680) {

                            this.hit_ball_destination.x = this.world.centerX + 260;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, this.world.centerX + 260, this.hit_ball_point, 200);
                            this.run_scored = 4;

                        } else if (this.hit_ball_velocity >= 680 && this.hit_ball_velocity < 700) {

                            this.hit_ball_destination.x = 640;
                            this.hit_ball_destination.y = this.hit_ball_point;
                            this.physics.arcade.moveToXY(this.hit_ball, 640, this.hit_ball_point, 400);
                            this.run_scored = 6;

                        }


                    }

                }

            } else {
                // TO DO
                // in case the ball is not being hit


            }

        }

    
        // after the ball is hit the collisio check will start        
        if (typeof this.hit_ball !== 'undefined') {
            // this block of code only runs when this.hit_ball variable is defined
            

            this.hit_ball.rotation -= 5;

            if (this.physics.arcade.collide(this.hit_ball, this.hit_ball_destination)) {

                this.hit_ball.body.velocity = 0;
                this.hit_ball.rotation = 0;

                this.run_scored_animation();

                this.update_score_box();
                
                this.time.events.add(Phaser.Timer.SECOND * 3, this.new_session, this);


            }


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
        //     this.physics.arcade.moveToXY(this.leftBell, 300, 0, 200);
        // } else if (this.physics.arcade.collide(this.midStump, this.rightBell) || this.physics.arcade.collide(this.rightStump, this.rightBell)) {
        //     this.rightBell.rotation = 1;
        //     this.physics.arcade.moveToXY(this.rightBell, 320, 0, 200);
        // }

    },

    render: function () {
        // cricket.debug.spriteInfo(this.bat, 30, 30, '#fff');
        cricket.debug.spriteBounds(this.bat);
        cricket.debug.cameraInfo(this.camera, 30, 150, '#f00');
        cricket.debug.text(this.time.fps || '--', 600, 20, "#f00", '22px Verdana');
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

        // ball is added to game
        this.ball = this.add.sprite(this.world.centerX - 50, this.world.centerY + 130, 'ball');
        this.ball.anchor.setTo(0.5);
        this.ballThrown = true;

        this.physics.arcade.enable(this.ball);
        this.physics.arcade.moveToXY(this.ball, this.randomX, this.randomY, 150);

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
            this.chosenRect = 'left';
        } else if (this.random_value > 0.334 && this.random_value <= 0.667) {
            this.chosenRect = 'mid';
        } else {
            this.chosenRect = 'right';
        }

    },

    getRandomX: function () {
        if (this.chosenRect == 'left') {
            return Math.random() * (this.leftRectMaxX - this.leftRectMinX) + this.leftRectMinX;
        } else if (this.chosenRect == 'mid') {
            return Math.random() * (this.midRectMaxX - this.midRectMinX) + this.midRectMinX;
        } else if (this.chosenRect == 'right') {
            return Math.random() * (this.rightRectMaxX - this.rightRectMinX) + this.rightRectMinX;
        }
    },

    getRandomY: function () {
        if (this.chosenRect == 'left') {
            return Math.random() * (this.leftRectMaxY - this.leftRectMinY) + this.leftRectMinY;
        } else if (this.chosenRect == 'mid') {
            return Math.random() * (this.midRectMaxY - this.midRectMinY) + this.midRectMinY;
        } else if (this.chosenRect == 'right') {
            return Math.random() * (this.rightRectMaxY - this.rightRectMinY) + this.rightRectMinY;
        }
    },

    checkHit: function () {

        this.ball.rotation -= 1;

        if (this.ball_velocity >= 170 && this.ball_velocity < 190) {

            this.hit_ball_velocity = Math.random() * (540 - 500) + 500;

        } else if (this.ball_velocity >= 190 && this.ball_velocity < 220) {

            this.hit_ball_velocity = Math.random() * (580 - 540) + 540;

        } else if (this.ball_velocity >= 220 && this.ball_velocity < 230) {

            this.hit_ball_velocity = Math.random() * (620 - 580) + 580;

        } else if (this.ball_velocity >= 230 && this.ball_velocity < 260) {

            this.hit_ball_velocity = Math.random() * (660 - 620) + 620;

        } else if (this.ball_velocity >= 260 && this.ball_velocity < 270) {

            this.hit_ball_velocity = Math.random() * (700 - 660) + 660;

        }


        if (this.physics.arcade.collide(this.bat, this.ball)) {

            if (this.shot_played == 'straight') {

                this.hit_ball_point = Math.random() * (420 - 220) + 220;
                this.physics.arcade.moveToXY(this.ball, this.hit_ball_point, 320, this.hit_ball_velocity);
                console.log('straight');
                this.hit_ball_shot = this.shot_played;
                this.shot_played = '';
                this.ball_hit = true;
                console.log(this.shot_played);


            } else if (this.shot_played == 'off') {

                this.hit_ball_point = Math.random() * (230 - 90) + 90;
                this.physics.arcade.moveToXY(this.ball, 0, this.hit_ball_point, this.hit_ball_velocity);
                console.log('off');
                this.hit_ball_shot = this.shot_played;
                this.shot_played = '';
                this.ball_hit = true;
                console.log(this.shot_played);

            } else if (this.shot_played == 'leg') {

                this.hit_ball_point = Math.random() * (230 - 90) + 90;
                this.physics.arcade.moveToXY(this.ball, 640, this.hit_ball_point, this.hit_ball_velocity);
                console.log('leg');
                this.hit_ball_shot = this.shot_played;
                this.shot_played = '';
                this.ball_hit = true;
                console.log(this.shot_played);

            } else {

                this.ball.body.velocity = 0;

            }


        }
    },


    run_scored_animation: function () {
                                    
        if (this.run_scored == 1) {
            this.run_text_score = 'ONE';
        } else if (this.run_scored == 2) {
            this.run_text_score = 'TWO';
        } else if (this.run_scored == 3) {
            this.run_text_score = 'THREE';
        } else if (this.run_scored == 4) {
            this.run_text_score = 'FOUR';
        } else if (this.run_scored == 6) {
            this.run_text_score = 'SIX';
        }
        
        this.scoreboard = this.add.image(this.world.centerX, this.world.centerY, 'scoreboard');
        this.scoreboard.anchor.setTo(0.5);
        this.scoreboard.scale.setTo(2, 2);

        this.run_text = this.add.bitmapText(this.world.centerX, this.world.centerY, 'digital', this.run_text_score, 70);
        this.run_text.anchor.setTo(0.5);

        // this.physics.arcade.enable([this.scoreboard, this.run_text]);
    },

    update_score_box: function () {
        
        this.total_runs += this.run_scored;
        this.total_runs_text.setText(this.total_runs + ' - ' + this.fallen_wickets);

        this.update_balls_left();

    },

    update_balls_left: function () {
        
        this.overs_left -= 1;
        this.overs_left_text.setText('BALLS LEFT - ' + this.overs_left);  
    },

    
    new_session: function () {

        this.stadium.visible = false;
        this.scoreboard.destroy();
        this.run_text.destroy();
        this.hit_ball.destroy();

    }



};
