// importing assets
function preload()
{

    // objects
    cricket.load.image('grass', 'assets/grass.png');
    cricket.load.image('pitch', 'assets/pitch.png');
    cricket.load.image('stump', 'assets/stump.png');
    cricket.load.image('bell', 'assets/bell.png');
    cricket.load.image('ball', 'assets/ball.png');

    // buttons
    cricket.load.spritesheet('bowl_btn', 'assets/bowl.png', 1105, 1105);
    cricket.load.spritesheet('straight_btn', 'assets/straight_btn.png', 1105, 1105);
    cricket.load.spritesheet('off_btn', 'assets/off_btn.png', 1105, 1105);
    cricket.load.spritesheet('leg_btn', 'assets/leg_btn.png', 1105, 1105);

    // animations
    cricket.load.atlasJSONArray('bowler', 'assets/bowler.png', 'assets/bowler.json');
    cricket.load.spritesheet('straight', 'assets/straight.png', 2000, 2000);
    cricket.load.spritesheet('off', 'assets/off.png', 2000, 2000);
    cricket.load.spritesheet('leg', 'assets/leg.png', 2000, 2000);

}

// variable declarations

// buttons
var bowl_btn, straight_btn, off_btn, leg_btn;

// shot animations
var straightShot, offShot, legShot;

var pitch, leg, off;
var bat, ball, drop, indicator, ballThrown = false;
var stump, stump1, stump2, stump3;
var bell, bell1, bell2;
var wicket, bowler;
var minX, minY, maxX, maxY;
var bounce, bowl;
var button, button1, button2;
var rect1minX, rect1maxX, rect1minY, rect1maxY;
var rect2minX, rect2maxX, rect2minY, rect2maxY;
var rect3minX, rect3maxX, rect3minY, rect3maxY;
var rect1, rect2, rect3;
var chosenRect;
