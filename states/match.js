
game.match = function (cricket) {

    // variables declaration

    var ground, pitch,

        // wicket components
        wicket, leftStump, midStump, rightStump, bowl_stump,
        leftBell, rightBell, bell,
        keeper, bowler,

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
        min_ball_velocity, max_ball_velocity,

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
        fallen_wickets, wicket_type,
        overs_left, overs_left_text,
        target_runs, target_runs_text,
        font_style,
        min_target_runs, max_target_runs,

        // buttons
        toggle_visibility,
        bowl_btn, straight_btn, off_btn, leg_btn,
        move_bat_left_btn, move_bat_right_btn,

        // fielders
        fielders,
        left_top_fielder, left_bottom_fielder,
        center_fielder,
        right_top_fielder, right_bottom_fielder;

};


game.match.prototype = {

    create: function () {

        // setting world bounds so that we can move the camera
        this.world.setBounds(0, 0, 640, 320);
        console.log(game.difficulty);
        if (game.difficulty === 'easy') {
            console.log(game.difficulty);
            this.min_ball_velocity = 150;
            this.max_ball_velocity = 180;
            this.min_target_runs = 80;
            this.max_target_runs = 100;

        } else if (game.difficulty === 'medium') {
            console.log(game.difficulty);
            this.min_ball_velocity = 180;
            this.max_ball_velocity = 210;
            this.min_target_runs = 100;
            this.max_target_runs = 120;

        } else if (game.difficulty === 'hard') {
            console.log(game.difficulty);
            this.min_ball_velocity = 210;
            this.max_ball_velocity = 240;
            this.min_target_runs = 120;
            this.max_target_runs = 150;

        }

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

        /**
         * adding keeper
         */
        this.keeper = this.add.sprite(this.world.centerX, this.world.centerY - 80, 'keeper', 0);
        this.keeper.anchor.setTo(1);

        /**
         * bowler
         */
        this.bowler = this.add.sprite(this.world.centerX - 100, this.world.centerY + 170, 'bowler', 0);
        this.bowler.anchor.setTo(0.5);
        this.bowler.scale.setTo(1.5);
        this.bowler.animations.add('bowl', '');

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
        this.ball_drop_region.beginFill(0x000000, 0.4);
        this.ball_drop_region.drawRect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
        this.ball_drop_region.endFill();

        // left rect coordinates
        this.leftRectMinX = this.minX;
        this.leftRectMinY = 0;
        this.leftRectMaxX = (this.maxX - this.minX) / 3 + this.minX;
        this.leftRectMaxY = this.minY - 90;

        // drawing left rect
        this.leftRect = this.add.graphics(0, 0);
        this.leftRect.beginFill(0x000000, 0);
        this.leftRect.drawRect(this.leftRectMinX, this.leftRectMinY, this.leftRectMaxX - this.leftRectMinX, this.leftRectMaxY);
        this.leftRect.endFill();

        // mid rect coordinates
        this.midRectMinX = this.leftRectMaxX;
        this.midRectMinY = 0;
        this.midRectMaxX = this.leftRectMaxX + this.section;
        this.midRectMaxY = this.minY - 90;

        // drawing mid rect
        this.midRect = this.add.graphics(0, 0);
        this.midRect.beginFill(0x00ff00, 0);
        this.midRect.drawRect(this.midRectMinX, this.midRectMinY, this.midRectMaxX - this.midRectMinX, this.midRectMaxY);
        this.midRect.endFill();

        // right rect coordinates
        this.rightRectMinX = this.midRectMaxX;
        this.rightRectMinY = 0;
        this.rightRectMaxX = this.maxX;
        this.rightRectMaxY = this.minY - 90;

        // drawing right rect
        this.rightRect = this.add.graphics(0, 0);
        this.rightRect.beginFill(0xd0f0f0, 0);
        this.rightRect.drawRect(this.rightRectMinX, this.rightRectMinY, this.rightRectMaxX - this.rightRectMinX, this.rightRectMaxY);
        this.rightRect.endFill();

        // ball drop point
        this.drop = this.add.sprite(300, 10, 'ball');
        this.drop.scale.setTo(0.0001);
        this.physics.arcade.enable(this.drop);

        // ******************************************************************************************************
        // wickets
        // ******************************************************************************************************

        this.leftStump = this.add.sprite(this.minX + 36, this.minY - 35, 'stump');
        this.leftStump.anchor.setTo(1);
        
        this.midStump = this.add.sprite(this.minX + 49, this.minY - 35, 'stump');
        this.midStump.anchor.setTo(1);
        
        this.rightStump = this.add.sprite(this.minX + 62, this.minY - 35, 'stump');
        this.rightStump.anchor.setTo(1);
        
        this.leftBell = this.add.sprite(this.minX + 40, this.minY - 85, 'bell');
        this.leftBell.anchor.setTo(0.5);
        this.leftBell.scale.setTo(1.2, 1);
        
        this.rightBell = this.add.sprite(this.minX + 53, this.minY - 85, 'bell');
        this.rightBell.anchor.setTo(0.5);
        this.rightBell.scale.setTo(1.2, 1);

        // enabling physics on objects
        this.physics.arcade.enable([this.leftStump, this.midStump, this.rightStump, this.leftBell, this.rightBell]);
        this.leftStump.body.immovable = true;
        this.midStump.body.immovable = true;
        this.rightStump.body.immovable = true;
        
        this.stump = this.add.image(this.minX + 33, this.minY + 165, 'stump');
        this.stump = this.add.image(this.minX + 46, this.minY + 165, 'stump');
        this.stump = this.add.image(this.minX + 59, this.minY + 165, 'stump');
        
        this.bell = this.add.image(this.minX + 37, this.minY + 164, 'bell');
        this.bell = this.add.image(this.minX + 50, this.minY + 164, 'bell');

        // ******************************************************************************************************
        // bat
        // ******************************************************************************************************

        this.bat = this.add.sprite(this.minX + 50, this.minY - 50, 'bat', 0);
        this.bat.anchor.setTo(0.5);
        this.physics.arcade.enable(this.bat);
        this.bat.body.immovable = true;

        // bat animations

        // straight shot
        this.straightShot = this.bat.animations.add('straight', [0, 1, 2, 3, 4, 5], 20);
        // off shot
        this.offShot = this.bat.animations.add('off', [0, 1, 2, 6, 7, 8, 9, 10], 20);
        // leg shot
        this.legShot = this.bat.animations.add('leg', [0, 1, 2, 11, 12, 13, 14, 15, 16, 17], 25);

        // ******************************************************************************************************
        // buttons
        // ******************************************************************************************************

        this.bowl_btn = this.add.button(this.minX - 200, this.minY + 100, 'bowl_btn', function () {
            this.bowler.animations.play('bowl', 20);
            this.time.events.add(Phaser.Timer.SECOND * 0.6, this.bowling, this);
        }, this, 1, 0, 1, 0);

        this.straight_btn = this.add.button(this.minX + 250, this.minY + 100, 'straight_btn', this.straight_shot, this, 1, 0, 1, 0);

        this.off_btn = this.add.button(this.minX + 190, this.minY + 45, 'off_btn', this.off_shot, this, 1, 0, 1, 0);

        this.leg_btn = this.add.button(this.minX + 310, this.minY + 45, 'leg_btn', this.leg_shot, this, 1, 0, 1, 0);

        // buttons for moving the bat left and right
        this.move_bat_left_btn = this.add.button(this.world.centerX + 150, 70, 'move_bat_btn', this.move_bat_left, this, 1, 0, 1, 0);

        this.move_bat_right_btn = this.add.button(this.world.centerX + 250, 70, 'move_bat_btn', this.move_bat_right, this, 3, 2, 3, 2);



        // ******************************************************************************************************
        // scoring
        // ******************************************************************************************************
        
        // stadium - for showing the ball trajectory after being hit by the bat
        this.stadium = this.add.image(this.world.centerX, this.world.centerY, 'stadium');
        this.stadium.anchor.setTo(0.5);
        this.stadium.scale.setTo(1.5, 1);
        this.stadium.visible = false;

        /**
         * fielders
         */
        this.fielders = this.add.group();
        this.left_top_fielder = this.fielders.create(this.world.centerX - 150, this.world.centerY - 70, 'fielder');
        this.left_bottom_fielder = this.fielders.create(this.world.centerX - 140, this.world.centerY + 40, 'fielder');
        this.center_fielder = this.fielders.create(this.world.centerX - 10, this.world.centerY + 90, 'fielder');
        this.right_top_fielder = this.fielders.create(this.world.centerX + 130, this.world.centerY - 40, 'fielder');
        this.right_bottom_fielder = this.fielders.create(this.world.centerX + 100, this.world.centerY + 50, 'fielder');
        this.fielders.visible = false;

        /**
         * hit_ball_destination
         */
        this.hit_ball_destination = this.add.sprite(0, 0, 'ball');
        this.hit_ball_destination.scale.setTo(0.0001);
        this.hit_ball_destination.anchor.setTo(0.5);
        this.physics.arcade.enable(this.hit_ball_destination);
        this.hit_ball_destination.body.immovable = true;
        this.hit_ball_destination.visible = false;

        // score box group
        this.score_box_group = this.add.group();

        // score box image
        this.score_box = this.add.image(5, 5, 'score_box');
        this.score_box.scale.setTo(3, 2);
        this.score_box_group.add(this.score_box);

        // intializing the random target_runs 
        this.target_runs = Math.floor(Math.random() * (this.max_target_runs - this.min_target_runs)) + this.min_target_runs;
        this.total_runs = 0;
        this.fallen_wickets = 0;
        this.overs_left = 36;
        this.font_style = {font: '17px Arial', fill: '#ffffff', align: 'left'};

        // score box text
        this.player_text = this.add.text(14, 8, 'YOU', this.font_style, this.score_box_group);
        this.total_runs_text = this.add.text(74, 8, this.total_runs + ' - ' + this.fallen_wickets, this.font_style, this.score_box_group);
        this.overs_left_text = this.add.text(14, 32, 'BALLS LEFT - ' + this.overs_left, this.font_style, this.score_box_group);
        this.target_runs_text = this.add.text(14, 56, 'TARGET - ' + this.target_runs, this.font_style, this.score_box_group);

        /**
         * scoring animation
         */
        this.scoreboard = this.add.image(this.world.centerX, this.world.centerY, 'scoreboard');
        this.scoreboard.anchor.setTo(0.5);
        this.scoreboard.scale.setTo(3, 2);
        this.scoreboard.visible = false;

        this.run_text_score = 'ZERO';
        this.run_text = this.add.bitmapText(this.world.centerX, this.world.centerY, 'digital', this.run_text_score, 70);
        this.run_text.anchor.setTo(0.5);
        this.run_text.visible = false;

    },

    update: function () {

        // ball drop and velocity change
        if (this.physics.arcade.collide(this.ball, this.drop)) {

            this.chooseRect();

            this.turnX = this.getRandomX();
            this.turnY = this.getRandomY();

            this.ball_velocity = Math.random() * (this.max_ball_velocity - this.min_ball_velocity) + this.min_ball_velocity;
            this.physics.arcade.moveToXY(this.ball, this.turnX, this.turnY, this.ball_velocity);
            // console.log("ball_velocity = " + this.ball_velocity);
        }

        if (this.ballThrown === true) {

            this.checkHit();

            // if the ball is not in camera
            if (!this.ball.inCamera) {
                
                this.ball.body.velocity = 0;
                this.ballThrown = false;

                if (this.hit_ball === true) {

                    this.ball_hit = true;
                    this.stadium.visible = true;
                    this.fielders.visible = true;

                    this.hit_ball = this.add.sprite(this.world.centerX - 7, this.world.centerY - 25, 'ball');
                    this.hit_ball.anchor.setTo(0.5);
                    this.hit_ball_destination.visible = true;
                    this.physics.arcade.enable(this.hit_ball);

                    // this.hit_ball_velocity = 550;
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

                    console.log(this.hit_ball_destination.x, this.hit_ball_destination.y);

                } else {
                    // TO DO
                    // in case the ball is not being hit
                    this.run_scored = 0;
                    this.run_scored_animation();
                    this.time.events.add(Phaser.Timer.SECOND * 3, function () {
                        this.update_balls_left();
                        this.new_session_miss();
                    }, this);

                }

            } else if (this.physics.arcade.collide(this.ball, this.leftStump)) {
                
                this.ballThrown = false;
                this.ball.rotation = 0;
                this.ball.body.velocity = 0;
                this.leftStump.rotation = -0.1;
                this.leftBell.rotation += 1;
                this.physics.arcade.moveToXY(this.leftBell, 300, 0, 200);

                this.wicket_type = 'bowled';
                this.out();
                this.update_balls_left();
                this.time.events.add(Phaser.Timer.SECOND * 3, this.new_session_miss, this);

            } else if (this.physics.arcade.collide(this.ball, this.midStump) || this.physics.arcade.collide(this.ball, this.rightStump)) {
                
                this.ballThrown = false;
                this.ball.rotation = 0;
                this.ball.body.velocity = 0;
                this.leftStump.rotation = -0.1;
                this.midStump.rotation = -0.1;
                this.rightStump.rotation = +0.1;
                this.leftBell.rotation += 1;
                this.physics.arcade.moveToXY(this.leftBell, 300, 0, 200);
                this.rightBell.rotation += 1;
                this.physics.arcade.moveToXY(this.rightBell, 320, 0, 200);

                this.wicket_type = 'bowled';
                this.out();
                this.update_balls_left();
                this.time.events.add(Phaser.Timer.SECOND * 3, this.new_session_miss, this);

            }

        }

        
        // after the ball is hit the collision check will start        
        if (this.ball_hit) {
            // this block of code will only run if the ball is hit
            console.log('ball_hit');

            this.hit_ball.rotation -= 5;
                
            if (this.left_top_fielder.overlap(this.hit_ball_destination) ||
                this.left_bottom_fielder.overlap(this.hit_ball_destination) ||
                this.center_fielder.overlap(this.hit_ball_destination) ||
                this.right_top_fielder.overlap(this.hit_ball_destination) ||
                this.right_bottom_fielder.overlap(this.hit_ball_destination)) {

                if (this.physics.arcade.collide(this.hit_ball, this.hit_ball_destination)) {

                    this.hit_ball.body.velocity = 0;
                    this.hit_ball.rotation = 0;
                    this.ball_hit = false;

                    this.wicket_type = 'catch';
                    this.out();
                    this.update_balls_left();
                    console.log('this.caught');
                    
                    this.time.events.add(Phaser.Timer.SECOND * 3, this.new_session_hit, this);

                }

            }

            if (this.physics.arcade.collide(this.hit_ball, this.hit_ball_destination)) {

                this.hit_ball.body.velocity = 0;
                this.hit_ball.rotation = 0;
                this.ball_hit = false;

                this.run_scored_animation();
                this.update_score_box();
                this.time.events.add(Phaser.Timer.SECOND * 3, this.new_session_hit, this);

            }


        }


        /**
         * match winning and losing conditions
         */
        // if all wickets are down or there are no balls left
        if (this.fallen_wickets >= 6 || this.overs_left <= 0) {
            this.runs_check();
        }

        // total runs scored is greater than or equal to target runs
        if (this.total_runs >= this.target_runs) {

            this.scoreboard.visible = true;
            this.run_text.visible = true;
            this.run_text.text = 'YOU WIN';

            // calling menu screen after 3 seconds
            this.time.events.add(Phaser.Timer.SECOND * 3, function () {
                this.state.start('menu');
            }, this);

        }


    }, // end of update function

    render: function () {
        // cricket.debug.spriteInfo(this.right_top_fielder, 30, 150, '#fff');
        // cricket.debug.spriteBounds(this.bat);
        // cricket.debug.cameraInfo(this.camera, 30, 150, '#f00');
        // cricket.debug.spriteBounds(this.left_top_fielder);
        // cricket.debug.spriteBounds(this.left_bottom_fielder);
        // cricket.debug.spriteBounds(this.center_fielder);
        // cricket.debug.spriteBounds(this.right_top_fielder);
        // cricket.debug.spriteBounds(this.right_bottom_fielder);
        cricket.debug.text(this.time.fps || '--', 600, 20, "#f00", '22px Verdana');
    },


    /**
     * custom functions
     */

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

        this.ball = this.add.sprite(this.world.centerX - 70, this.world.centerY + 100, 'ball');
        this.ball.anchor.setTo(0.5);
        this.physics.arcade.enable(this.ball);
        this.ballThrown = true;

        this.physics.arcade.moveToXY(this.ball, this.randomX, this.randomY, Math.random() * (this.max_ball_velocity - this.min_ball_velocity) + this.min_ball_velocity);

        this.bowl_btn.visible = false;

        this.keeper.frame = 1;

    },

    // function to play straight shot
    straight_shot: function () {
        this.straightShot.play();
        this.shot_played = 'straight';
        this.toggle_visibility = false;
        this.toggle_buttons_visibility();
    },

    // function to play off shot
    off_shot: function () {
        this.offShot.play();
        this.shot_played = 'off';
        this.toggle_visibility = false;
        this.toggle_buttons_visibility();
    },

    // function to play leg shot
    leg_shot: function () {
        this.legShot.play();
        this.shot_played = 'leg';
        this.toggle_visibility = false;
        this.toggle_buttons_visibility();
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

        if (this.ball_velocity >= 150 && this.ball_velocity < 170) {

            this.hit_ball_velocity = Math.random() * (540 - 500) + 500;

        } else if (this.ball_velocity >= 170 && this.ball_velocity < 190) {

            this.hit_ball_velocity = Math.random() * (580 - 540) + 540;

        } else if (this.ball_velocity >= 190 && this.ball_velocity < 200) {

            this.hit_ball_velocity = Math.random() * (620 - 580) + 580;

        } else if (this.ball_velocity >= 200 && this.ball_velocity < 220) {

            this.hit_ball_velocity = Math.random() * (660 - 620) + 620;

        } else if (this.ball_velocity >= 220 && this.ball_velocity < 240) {

            this.hit_ball_velocity = Math.random() * (700 - 660) + 660;

        }


        if (this.physics.arcade.collide(this.bat, this.ball)) {

            if (this.shot_played == 'straight') {

                this.hit_ball_point = Math.random() * (420 - 220) + 220;
                this.physics.arcade.moveToXY(this.ball, this.hit_ball_point, 320, this.hit_ball_velocity);
                this.hit_ball_shot = this.shot_played;
                this.shot_played = '';
                this.hit_ball = true;


            } else if (this.shot_played == 'off') {

                this.hit_ball_point = Math.random() * (230 - 90) + 90;
                this.physics.arcade.moveToXY(this.ball, 0, this.hit_ball_point, this.hit_ball_velocity);
                this.hit_ball_shot = this.shot_played;
                this.shot_played = '';
                this.hit_ball = true;


            } else if (this.shot_played == 'leg') {

                this.hit_ball_point = Math.random() * (230 - 90) + 90;
                this.physics.arcade.moveToXY(this.ball, 640, this.hit_ball_point, this.hit_ball_velocity);
                this.hit_ball_shot = this.shot_played;
                this.shot_played = '';
                this.hit_ball = true;

            } else {

                this.ball.body.velocity = 0;
                this.ballThrown = false;

                this.run_scored = 0;
                this.run_scored_animation();
                this.update_balls_left();
                this.time.events.add(Phaser.Timer.SECOND * 3, function () {
                        this.new_session_miss();
                    }, this);

            }


        }
    },

    run_scored_animation: function () {

        if (this.run_scored == 0) {
            this.run_text_score = 'ZERO';
        } else if (this.run_scored == 1) {
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
        
        this.scoreboard.visible = true;
        this.run_text.visible = true;
        this.run_text.text = this.run_text_score;

    },

    update_score_box: function () {
        
        this.total_runs += this.run_scored;
        this.total_runs_text.setText(this.total_runs + ' - ' + this.fallen_wickets);
        console.log('this ran');

        this.update_balls_left();

    },

    update_balls_left: function () {
        
        this.overs_left -= 1;
        this.overs_left_text.setText('BALLS LEFT - ' + this.overs_left);  
    },
    
    new_session_hit: function () {

        this.bowling_destroy();
        this.batting_destroy();
        this.scoring_destroy();

        this.bowl_btn.visible = true;
        this.toggle_visibility = true;
        this.toggle_buttons_visibility();
        this.wicket_type = null;
        this.bat.frame = 0;

    },

    new_session_miss: function () {

        this.bowling_destroy();
        this.scoring_destroy();
        this.wickets_destroy();

        this.bowl_btn.visible = true;
        this.toggle_visibility = true;
        this.toggle_buttons_visibility();        
        this.bat.frame = 0;
        this.shot_played = null;
        this.wicket_type = null;
        this.bat.x = this.minX + 50;
        this.bat.y = this.minY - 50;

    },

    bowling_destroy: function () {
    
        // from create
        this.bowler.frame = 0;

        // from bowling
        this.ball.destroy();
        this.ballThrown = false;
        this.drop.body.velocity = 0;
        this.ballX = null;
        this.ballY = null;
        this.randomX = null;
        this.randomY = null;

        // from update and chooseRect
        this.random_value = null;
        this.chosenRect = null;
        this.turnX = null;
        this.turnY = null;
        this.ball_velocity = null;

    },

    batting_destroy: function () {
        
        this.hit_ball_velocity = null;
        this.shot_played = null;
        this.hit_ball_point = null;
        this.hit_ball_shot = null;
        this.hit_ball.destroy();
        this.hit_ball_destination.visible = false;
        this.hit_ball_velocity = null;
        this.run_scored = null;
        this.fielders.visible = false;
        this.ball_hit = false;

    },

    scoring_destroy: function () {

        this.stadium.visible = false;
        this.run_text_score = 'ZERO';
        this.scoreboard.visible = false;
        this.run_text.visible = false;

    },

    wickets_destroy: function () {

        this.leftStump.rotation = 0;
        this.midStump.rotation = 0;
        this.rightStump.rotation = 0;
        this.leftBell.rotation = 0;
        this.leftBell.body.velocity = 0;
        this.leftBell.x = this.minX + 40;
        this.leftBell.y = this.minY - 85;
        this.rightBell.rotation = 0;
        this.rightBell.body.velocity = 0;
        this.rightBell.x = this.minX + 53;
        this.rightBell.y = this.minY - 85;

    },

    toggle_buttons_visibility: function () {
        if (this.toggle_visibility === true) {
            this.straight_btn.visible = true;
            this.off_btn.visible = true;
            this.leg_btn.visible = true;
            this.move_bat_left_btn.visible = true;
            this.move_bat_right_btn.visible = true;
            this.keeper.frame = 0;
        } else {
            this.straight_btn.visible = false;
            this.off_btn.visible = false;
            this.leg_btn.visible = false;
            this.move_bat_left_btn.visible = false;
            this.move_bat_right_btn.visible = false;
            this.keeper.frame = 1;
        }
    
    },

    runs_check: function () {
        
        this.scoreboard.visible = true;
        this.run_text.visible = true;

        if (this.total_runs == (this.target_runs - 1)) {

            this.run_text.text = 'DRAW';
                
        } else {

            this.run_text.text = 'YOU LOSE';

        }
        
        // calling menu screen after 3 seconds
        this.time.events.add(Phaser.Timer.SECOND * 3, function () {
            this.state.start('menu');
        }, this);

    },

    move_bat_left: function () {
        
        if (this.bat.x > 260) {
            this.bat.x -= 10;
        }

    },

    move_bat_right: function () {
        
        if (this.bat.x < 380) {
            this.bat.right += 10;
        }

    },

    out: function () {
        
        this.scoreboard.visible = true;
        this.run_text.visible = true;

        if (this.wicket_type == 'bowled') {
            this.run_text.text = 'BOWLED';
        } else if (this.wicket_type == 'catch') {
            this.run_text.text = 'CATCH OUT';
        }

        this.update_fallen_wickets();

    },

    update_fallen_wickets: function () {

        this.fallen_wickets += 1;
        this.total_runs_text.text = this.total_runs + ' - ' + this.fallen_wickets;

    }

};
