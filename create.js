function create() {

    cricket.world.setBounds(0, 0, 1000, 1000);
    cricket.physics.startSystem(Phaser.Physics.ARCADE);

    cricket.camera.setPosition(cricket.world.centerX - 300, cricket.world.centerY - 135);
    ground = cricket.add.tileSprite(0, 0, 640, 320, 'grass');
    ground.alpha = 1;
    ground.scale.setTo(1, 1);
    ground.fixedToCamera = true;
    //ground.anchor.setTo(0.5,0.5);
    //stadium = cricket.add.image(0,0, 'stadium');
    pitch = cricket.add.image(cricket.world.centerX, cricket.world.centerY + 80, 'pitch');

    pitch.scale.setTo(0.07, 0.05);
    pitch.anchor.setTo(0.5, 0.5);
    // console.log(pitch);

    minY = cricket.world.centerY - 24;
    maxY = cricket.world.centerY + 50;
    minX = cricket.world.centerX - 50;
    maxX = cricket.world.centerX + 30;


    var rect = cricket.add.graphics(0, 0);
    // rect.beginFill('0x000', 0.7);
    rect.drawRect(minX, minY, maxX - minX, maxY - minY);
    rect.endFill();

    var section = (maxX - minX) / 3;

    rect1minX = minX;
    rect1minY = 0;
    rect1maxX = (maxX - minX) / 3 + minX;
    rect1maxY = minY - 90;

    rect1 = cricket.add.graphics(0, 0);
    //    rect1.beginFill(0x000000, 0.7);
    rect1.drawRect(rect1minX, rect1minY, rect1maxX - rect1minX, rect1maxY);
    rect1.endFill();

    rect2minX = rect1maxX;
    rect2minY = 0;
    rect2maxX = rect1maxX + section;
    rect2maxY = minY - 90;

    rect2 = cricket.add.graphics(0, 0);
    //    rect2.beginFill(0x00ff00, 0.7);
    rect2.drawRect(rect2minX, rect2minY, rect2maxX - rect2minX, rect2maxY);
    rect2.endFill();

    rect3minX = rect2maxX;
    rect3minY = 0;
    rect3maxX = maxX;
    rect3maxY = minY - 90;

    rect3 = cricket.add.graphics(0, 0);
    //    rect3.beginFill(0xd0f0f0, 0.7);
    rect3.drawRect(rect3minX, rect3minY, rect3maxX - rect3minX, rect3maxY);
    rect3.endFill();



    drop = cricket.add.sprite(300, 10, 'bell');
    drop.scale.setTo(0.0001);

    indicator = cricket.add.sprite(300, 10, 'bell');
    indicator.scale.setTo(0.001);

    console.log(cricket.world.centerX);

    stump1 = cricket.add.sprite(minX + 37, minY - 02, 'stump');
    stump1.scale.setTo(0.005, 0.014);
    stump1.anchor.setTo(1);

    stump2 = cricket.add.sprite(minX + 47, minY - 02, 'stump');
    stump2.scale.setTo(0.005, 0.014);
    stump2.anchor.setTo(1);

    stump3 = cricket.add.sprite(minX + 57, minY - 02, 'stump');
    stump3.scale.setTo(0.005, 0.014);
    stump3.anchor.setTo(1);

    bell1 = cricket.add.sprite(minX + 39, minY - 55, 'bell');
    bell1.scale.setTo(0.005, 0.005);
    bell1.anchor.setTo(0.5, 0.5);

    bell2 = cricket.add.sprite(minX + 50, minY - 55, 'bell');
    bell2.scale.setTo(0.005, 0.005);
    bell2.anchor.setTo(0.5, 0.5);


    stump = cricket.add.image(minX + 30, minY + 155, 'stump');
    stump.scale.setTo(0.006, 0.012);
    stump = cricket.add.image(minX + 42, minY + 155, 'stump');
    stump.scale.setTo(0.006, 0.012);
    stump = cricket.add.image(minX + 54, minY + 155, 'stump');
    stump.scale.setTo(0.006, 0.012);

    bell = cricket.add.image(minX + 32, minY + 153, 'bell');
    bell.scale.setTo(0.006, 0.006);
    bell = cricket.add.image(minX + 45, minY + 153, 'bell');
    bell.scale.setTo(0.006, 0.006);

    // bat = cricket.add.sprite(minX + 200, minY, 'bat');
    // bat.scale.setTo(0.12, 0.09);
    // bat.anchor.setTo(1);
    // bat.rotation = 0.5;

    // ******************************************************************
    // bat

    bat = cricket.add.sprite(minX + 130, minY + 30, 'straight', 1);
    bat.scale.setTo(0.09, 0.07);
    bat.anchor.setTo(0.5);
    straightShot = bat.animations.add('straight', '', 10);
    offShot = bat.animations.add('off', '', 10);
    legShot = bat.animations.add('leg', '', 10);

    cricket.physics.arcade.enable([drop, stump1, stump2, stump3, bell1, bell2]);
    // ball.body.velocity = 0;
    stump1.body.mass = 10000;
    stump2.body.mass = 10000;
    stump3.body.mass = 10000;



    // cricket.button = cricket.add.button(100,100);
    // cursors = cricket.input

    bowler = cricket.add.sprite(minX - 50, minY + 160, 'bowler');
    bowler.scale.setTo(0.08, 0.08);
    bowler.anchor.setTo(0.5, 0.5);
    bowl = bowler.animations.add('bowl', '', 15);



    // ******************************************************************
    // adding buttons

    bowl_btn = cricket.add.button(minX - 200, minY + 100, 'bowl_btn', bowling, cricket, 1, 0, 1, 0);
    bowl_btn.scale.setTo(0.05, 0.05);

    straight_btn = cricket.add.button(minX + 260, minY + 100, 'straight_btn', straight_shot, cricket, 1, 0, 1, 0);
    straight_btn.scale.setTo(0.05, 0.05);

    off_btn = cricket.add.button(minX + 200, minY + 45, 'off_btn', off_shot, cricket, 1, 0, 1, 0);
    off_btn.scale.setTo(0.05, 0.05);

    leg_btn = cricket.add.button(minX + 320, minY + 45, 'leg_btn', leg_shot, cricket, 1, 0, 1, 0);
    leg_btn.scale.setTo(0.05, 0.05);

}
