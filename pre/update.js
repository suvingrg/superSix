function update() {

    ground.tilePosition.x = -cricket.camera.x;
    ground.tilePosition.y = -cricket.camera.y;

    if (cricket.physics.arcade.collide(ball, drop)) {
        var turnX, turnY;
        chosenRect = chooseRect();
        if (chosenRect == 'rect1') {
            turnX = getRandomX(1);
            turnY = getRandomY(1);
        } else if (chosenRect == 'rect2') {
            turnX = getRandomX(2);
            turnY = getRandomY(2);
        } else if (chosenRect == 'rect3') {
            turnX = getRandomX(3);
            turnY = getRandomY(3);
        }
        cricket.physics.arcade.moveToXY(ball, turnX, turnY, 200);
    }

    // console.log(ball.overlap(stump1), ball.overlap(stump2), ball.overlap(stump3));
    if (ballThrown === true) {
        checkHit();
    }

    if (cricket.physics.arcade.collide(ball, stump1)) {
        ball.rotation = 0;
        ball.body.velocity = 0;
        stump1.body.velocity = 0;
        stump2.body.velocity = 0;
        stump3.body.velocity = 0;
        stump1.rotation = -0.2;
    } else if (cricket.physics.arcade.collide(ball, stump2) || cricket.physics.arcade.collide(ball, stump3)) {
        ball.rotation = 0;
        ball.body.velocity = 0;
        stump1.body.velocity = 0;
        stump2.body.velocity = 0;
        stump3.body.velocity = 0;
        stump2.rotation = -0.1;
        stump3.rotation = +0.2;
    }

    if (cricket.physics.arcade.collide(stump1, bell1) || cricket.physics.arcade.collide(stump2, bell1)) {
        bell1.rotation = 1;
        cricket.physics.arcade.moveToXY(bell1, 300, 0, 200);
    } else if (cricket.physics.arcade.collide(stump2, bell2) || cricket.physics.arcade.collide(stump3, bell2)) {
        bell2.rotation = 1;
        cricket.physics.arcade.moveToXY(bell2, 320, 0, 200);
    }

    // cricket.physics.arcade.collide(ball, bat);
    // cricket.physics.arcade.collide(ball, bell1);
    // cricket.physics.arcade.collide(ball, bell2);
    // cricket.physics.arcade.collide(stump3, bell1);
    // cricket.physics.arcade.collide(stump1, bell2);
    // cricket.physics.arcade.collide(ball, batsman);

}
