function setBallPositionX()
{
    var ballX = Math.random() * (maxX-minX) + minX;
    return ballX;
}

function setBallPositionY()
{
    var ballY = Math.random() * (maxY-minY) + minY;
    return ballY;
}

// setInterval(setBallPosition, 3000);

// ********************************************************************
// animations

// bowling
function bowling()
{
    var randomX = setBallPositionX();
    var randomY = setBallPositionY();

    drop.x = randomX;
    drop.y = randomY;
    indicator.x = randomX;
    indicator.y = randomY;
    console.log(randomX, randomY);
    console.log('clicked');
    bowl.play();
    console.log(bowl.isFinished);


    ball = cricket.add.sprite(minX -50, minY +130, 'ball');
    ball.scale.setTo(0.002,0.002);
    ball.anchor.setTo(0.5, 0.5);
    ballThrown = true;

    cricket.physics.arcade.enable(ball);
    cricket.physics.arcade.moveToXY(ball, randomX, randomY, 500, 2000);

    // cricket.camera.follow(ball);
    // cricket.camera.focusOnXY(randomX, randomY);

}

// straight shot
function straight_shot()
{
    straightShot.play();
}

// off shot
function off_shot()
{

    offShot.play();

}

function leg_shot()
{

    legShot.play('leg');
}

function checkHit()
{
    ball.rotation -= 1;
}


function chooseRect() {
    var value = Math.random();
    if (value <= 0.334) {
        return 'rect1';
    } else if (value > 0.334 && value <= 0.667) {
        return 'rect2';
    } else {
        return 'rect3';
    }

}

function getRandomX(value) {
    if (value == 1) {
        return Math.random() * (rect1maxX - rect1minX) + rect1minX;
    } else if (value == 2) {
        return Math.random() * (rect2maxX - rect2minX) + rect2minX;
    } else if (value == 3) {
        return Math.random() * (rect3maxX - rect3minX) + rect3minX;
    }
}

function getRandomY(value) {
    if (value == 1) {
        return Math.random() * (rect1maxY - rect1minY) + rect1minY;
    } else if (value == 2) {
        return Math.random() * (rect2maxY - rect2minY) + rect2minY;
    } else if (value == 3) {
        return Math.random() * (rect3maxY - rect3minY) + rect3minY;
    }
}
