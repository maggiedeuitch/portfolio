//there is an entity(ball)
//player cannot move out of bounds
//ball cannot move out of bounds

//user can move player using keyboard
//balls drop from top of canvas

//there is a score that counts every time player collides with ball
//there is health points (three chances) that deducts when ball touches bottom of screen

//when ball touches player, it will bounce in opposite direction and add to points
//when ball touches bottom of screen, deduct one chance from health points
//when health points run out, game is over


const app = {}
//creates canvas in DOM
app.canvas = $("#ctx").get(0);
app.ctx= app.canvas.getContext("2d");
app.ctx.font = '30px Arial';
app.height = 800;
app.width = 600;
app.cHeight = 800;
app.cWidth = 600;

app.left = $(".fa-arrow-circle-left");
app.right = $(".fa-arrow-circle-right");
app.newGameButton = $("#new-game-button");
app.instructions = $("#instructions");


//resize canvas depending on screen size
app.resizeCanvas = function () {
    app.cWidth = window.innerWidth - 4;
    app.cHeight = window.innerHeight - 4;

    let ratio = 3 / 4;
    if (app.cHeight < app.cWidth / ratio)
        app.cWidth = app.cHeight * ratio;
    else
        app.cHeight = app.cWidth / ratio;

    app.canvas.width = app.width;
    app.canvas.height = app.height;

    app.canvas.style.width = "" + app.cWidth + "px";
    app.canvas.style.height = "" + app.cHeight + "px";
}
app.resizeCanvas();

$(window).on("resize", function () {
    app.resizeCanvas();
});




app.frameCount = 0;
app.score = 0;



//display score 
app.scoreDisplay = $("#score");
app.showScore = function () {
    $(app.scoreDisplay).text(`Score: ${app.score}`);
}
// for sprite sheets ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

//display health
app.healthDisplay = $("#health");
app.showHealth = function () {
    if (app.spritesAndEntities.player.hp === 1) {
        $(app.healthDisplay).removeClass("health-two")
        $(app.healthDisplay).removeClass("health-three")
        $(app.healthDisplay).addClass("health-one")
        console.log("one");
    } else if (app.spritesAndEntities.player.hp === 2) {
        $(app.healthDisplay).removeClass("health-one")
        $(app.healthDisplay).removeClass("health-three")
        $(app.healthDisplay).addClass("health-two")
        console.log("two");
    } else {
        $(app.healthDisplay).removeClass("health-one")
        $(app.healthDisplay).removeClass("health-two")
        $(app.healthDisplay).addClass("health-three")
        console.log("three");
    }
}


app.gameOver = $(".game-over");
app.playAgain = $(".play-again");

//update game
app.update = function () {
    if (app.spritesAndEntities.player.hp === 0) {
        console.log("game over!");
        app.frameCount = 0;
        $(app.gameOver).show();
        $(app.playAgain).show();
        app.yesPressed();
    }
    else {
    app.ctx.clearRect(0, 0, app.width, app.height);
    app.frameCount++;

    if (app.frameCount % 250 === 0)
        app.spritesAndEntities.randomlyGenerateBall();
    if (app.frameCount % 600 === 0)
        app.spritesAndEntities.randomlyGenerateUpgrade();
    
    

    for (let key in app.spritesAndEntities.ballList) {
        app.spritesAndEntities.updateBall(app.spritesAndEntities.ballList[key]);
        const collision = app.spritesAndEntities.testCollision(app.spritesAndEntities.player, app.spritesAndEntities.ballList[key]);

        if (collision) {
            // console.log("collision!");
            app.spritesAndEntities.ballList[key].spdX = -app.spritesAndEntities.ballList[key].spdX;
            app.spritesAndEntities.ballList[key].spdY = -app.spritesAndEntities.ballList[key].spdY;
            app.score++
        }

        if (app.spritesAndEntities.ballList[key].y > app.height) {
            app.spritesAndEntities.player.hp -= 1;
            delete app.spritesAndEntities.ballList[key];
        }
    }//for collision testing for ball


    for (let key in app.spritesAndEntities.upgradeList) {
        app.spritesAndEntities.updateUpgrades(app.spritesAndEntities.upgradeList[key]);
        const collision = app.spritesAndEntities.testCollision(app.spritesAndEntities.player, app.spritesAndEntities.upgradeList[key]);

        if (collision) {
            // console.log("collision!");
            app.spritesAndEntities.player.spdX = app.spritesAndEntities.player.spdX + 10;
            delete app.spritesAndEntities.upgradeList[key];
        }
    }//for

    }//else

    app.spritesAndEntities.updatePlayerPosition();
    app.spritesAndEntities.drawPlayer(app.spritesAndEntities.player);
    app.spritesAndEntities.drawEntity(app.spritesAndEntities.ball);
    app.spritesAndEntities.drawUpgrade(app.spritesAndEntities.upgrade)
    app.showScore();
    app.showHealth();
}//update

app.init = function () {
    app.update();
    $(".ui-loader").hide();
    $(app.gameOver).hide();
    $(app.playAgain).hide();
}//init

//start new game
app.newGame = function () {
    $(app.gameOver).hide();
    $(app.playAgain).hide();
    $(app.chooseYourDog).show();
    app.dog();
    app.spritesAndEntities.player.hp = 3;
    app.spritesAndEntities.player.spdX = 10;
    app.frameCount = 0;
    app.score = 0;
    app.spritesAndEntities.ballList = {};  
    app.spritesAndEntities.randomlyGenerateBall();
}//start new game


//load sprite and entity images
app.allImages = {};
app.allImages.player = new Image();
app.allImages.player.src = "assets/kenzo.png"
app.allImages.kenzo = new Image();
app.allImages.kenzo.src = "assets/kenzo.png";
app.allImages.junior = new Image();
app.allImages.junior.src = "assets/junior.png";
app.allImages.dug = new Image();
app.allImages.dug.src = "assets/dug.png";
app.allImages.ball = new Image();
app.allImages.ball.src = "assets/ball.png";
app.allImages.health = new Image();
app.allImages.health.src = "assets/health.png"
app.allImages.cupcake = new Image();
app.allImages.cupcake.src = "assets/cupcake.png"


//play again input
app.clickYes = $("#click-yes");
app.clickNo = $("#click-no");

$(app.clickYes).on("click", function(e){
    e.preventDefault();
    app.newGame();
});

$(app.clickNo).on("click", function(e){
    e.preventDefault();
    return;
});

app.yes = false;
app.no = false;
app.yesPressed = function () {
    if (app.yes) 
        app.newGame();
    if (app.no)
        return;
}


//info for all sprites and entities in game
app.spritesAndEntities = {};
app.spritesAndEntities.player = {
    name: "Kenzo",
    x: 300,
    spdX: 10,
    y: 700,
    hp: 3,
    width: 100,
    height: 100,
    img: app.allImages.player,
    // user keyboard interaction
    // pressingDown: false,
    // pressingUp: false,
    pressingLeft: false,
    pressingRight: false
};//player
app.spritesAndEntities.updatePlayerPosition = function () {
    if (app.cWidth <= 365) {
        app.spritesAndEntities.player.y = 600;
    } else if (app.cWidth <= 450) {
        app.spritesAndEntities.player.y = 650;
    } else {
        app.spritesAndEntities.player.y=700;
    };
        
    if (app.spritesAndEntities.player.pressingRight)
        app.spritesAndEntities.player.x += app.spritesAndEntities.player.spdX;
    if (app.spritesAndEntities.player.pressingLeft)
        app.spritesAndEntities.player.x += -app.spritesAndEntities.player.spdX;
    if (app.spritesAndEntities.player.pressingDown)
        app.spritesAndEntities.player.y += 10;
    if (app.spritesAndEntities.player.pressingUp)
        app.spritesAndEntities.player.y += -10;

    //check out of bounds for player
    if (app.spritesAndEntities.player.x < app.spritesAndEntities.player.width/10)
        app.spritesAndEntities.player.x = app.spritesAndEntities.player.width/10;
    if (app.spritesAndEntities.player.x > app.width - app.spritesAndEntities.player.width)
        app.spritesAndEntities.player.x = app.width - app.spritesAndEntities.player.width;
    if (app.spritesAndEntities.player.y < app.spritesAndEntities.player.height / 2)
        app.spritesAndEntities.player.y = app.spritesAndEntities.player.height / 2;
    if (app.spritesAndEntities.player.y > app.height - app.spritesAndEntities.player.height / 2)
        app.spritesAndEntities.player.y = app.height - app.spritesAndEntities.player.height / 2;
}//update player position
app.spritesAndEntities.drawPlayer = function (entity) {
    app.ctx.save();
    app.ctx.drawImage(entity.img, entity.x, entity.y - entity.height, entity.width, entity.height);
    app.ctx.restore();
}// draw player

app.spritesAndEntities.ballList = {};
app.spritesAndEntities.ball = function (id, x, spdX, spdY) {
    let ball1 = {
        id: id,
        x: x,
        y: 0,
        spdX: spdX,
        spdY: spdY,
        width: 30,
        height: 30,
        img: app.allImages.ball
    };
    app.spritesAndEntities.ballList[id] = ball1;
}//ball info

app.spritesAndEntities.upgradeList = {};
app.spritesAndEntities.upgrade = function (id, x) {
    let upgrade1 = {
        id: id,
        x: x,
        y: 650,
        radius: 10,
        width: 50,
        height: 50,
        img: app.allImages.cupcake
    };
    app.spritesAndEntities.upgradeList[id] = upgrade1;
}//upgrades info 


app.spritesAndEntities.updateBall = function (ball) {
    app.spritesAndEntities.updateEntityPosition(ball);
    app.spritesAndEntities.drawEntity(ball);
}
app.spritesAndEntities.drawEntity = function (entity) {
    app.ctx.save();//saves the style
    app.ctx.drawImage(app.allImages.ball, entity.x, entity.y, entity.width, entity.height);
    app.ctx.restore();
}

app.spritesAndEntities.updateUpgrades = function (upgrade) {
    app.spritesAndEntities.drawUpgrade(upgrade);
}

app.spritesAndEntities.drawUpgrade = function (entity) {
    app.ctx.save();//saves the style
    app.ctx.drawImage(app.allImages.cupcake, entity.x, entity.y, entity.width, entity.height);
    app.ctx.restore();
}




app.spritesAndEntities.testCollision = function (entity1, entity2) {
    //return if colliding (true/false)
    const rect1 = {
        x: entity1.x - entity1.width / 2,
        y: entity1.y - entity1.height / 2,
        width: entity1.width,
        height: entity1.height
    }
    const rect2 = {
        x: entity2.x - entity2.width / 2,
        y: entity2.y - entity2.height / 2,
        width: entity2.width,
        height: entity2.height
    }
    return app.spritesAndEntities.testCollisionRectRect(rect1, rect2);
}
app.spritesAndEntities.testCollisionRectRect = function (rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width
        && rect2.x <= rect1.x + rect1.width
        && rect1.y <= rect2.y + rect2.height
        && rect2.y <= rect1.y + rect1.height;
}
app.spritesAndEntities.updateEntityPosition = function (entity) {
    //entity movement
    entity.x += entity.spdX;
    entity.y += entity.spdY;
    //collision detection to change the direction of entity when it hits the boundaries
    if (entity.x < 0 || entity.x > app.width) {
        entity.spdX = -entity.spdX;
    }
    if (entity.y < 0) {
        entity.spdY = -entity.spdY;
    }
}
app.spritesAndEntities.randomlyGenerateBall = function () {
    let id = Math.random();
    let x = Math.random() * app.width;
    let spdX = 5 + Math.random() * 3;
    let spdY = 5 + Math.random() * 3;
    app.spritesAndEntities.ball(id, x, spdX, spdY);
}

app.spritesAndEntities.randomlyGenerateUpgrade = function () {
    let id = Math.random();
    let x = Math.random() * app.width - 5;
    app.spritesAndEntities.upgrade(id, x);
}

//keyboard input to move player and start new game
document.onkeydown = function (event) {
    if (event.keyCode === 68) //d
        app.spritesAndEntities.player.pressingRight = true;
    if (event.keyCode === 65) //a
        app.spritesAndEntities.player.pressingLeft = true;
    if (event.keyCode === 89) //y
        app.yes = true;
    if (event.keyCode === 78) //n
        app.no = true;
}//keydown

document.onkeyup = function (event) {
    if (event.keyCode === 68) //d
        app.spritesAndEntities.player.pressingRight = false;
    if (event.keyCode === 65) //a
        app.spritesAndEntities.player.pressingLeft = false;
    if (event.keyCode === 89) //y
        app.yes = false;
    if (event.keyCode === 78) //y
        app.no = false;

}//keyup

// document.onmousemove = function (mouse) {
//     let mouseX = mouse.clientX - app.canvas.getBoundingClientRect().left;
//     // let mouseY = mouse.clientY;

//     if (mouseX < app.spritesAndEntities.player.width/2)
//             mouseX = app.spritesAndEntities.player.width/2;
//     if (mouseX > app.width - app.spritesAndEntities.player.width/2)
//             mouseX = app.width - app.spritesAndEntities.player.width/2;

//     app.spritesAndEntities.player.x = mouseX;
//     // app.spritesAndEntities.player.y = mouseY;
// }

document.oncontextmenu = function (mouse) {
    mouse.preventDefault();
}

//call update 
setInterval(app.update, 40);

//call when game over
// app.newGame();

//top bar






//control bar 
$(app.newGameButton).on("click", function(event){
    event.preventDefault();
    app.newGame();
});

$(app.left).on("mousedown", function(){
    // event.preventDefault();
    console.log("left");
    app.spritesAndEntities.player.x -= 10;
});
$(app.right).on("mousedown", function () {
    // event.preventDefault();
    console.log("right");
    app.spritesAndEntities.player.x += 10;
});
$(app.left).on("mouseup", function () {
    // event.preventDefault();
    console.log("left");
    app.spritesAndEntities.player.x -= 10;
});
$(app.right).on("mouseup", function () {
    // event.preventDefault();
    console.log("right");
    app.spritesAndEntities.player.x += 10;
});

//player chooses character
app.chooseYourDog = $("#choose-your-dog");
app.kenzo = $("#kenzo");
app.junior = $("#junior");
app.dug = $("#dug");

app.dog = function(){
    $(app.kenzo).on("click", function () {
        console.log("kenzo");
        app.spritesAndEntities.player.img = app.allImages.kenzo;
        app.spritesAndEntities.player.name = "Kenzo";
        app.chooseYourDog.hide();
        $("p").remove(".dog-name");
        app.instructions.append("<p class='dog-name'> Tap the arrows to move " + app.spritesAndEntities.player.name + "</p>");
        app.init();
    });
    $(app.junior).on("click", function () {
        console.log("junior");
        app.spritesAndEntities.player.img = app.allImages.junior;
        app.spritesAndEntities.player.name = "Junior";
        app.chooseYourDog.hide();
        $("p").remove(".dog-name");
        app.instructions.append("<p class='dog-name'> Tap the arrows to move " + app.spritesAndEntities.player.name + "</p>");
        app.init();
    });
    $(app.dug).on("click", function () {
        console.log("dug");
        app.spritesAndEntities.player.img = app.allImages.dug;
        app.spritesAndEntities.player.name = "Dug";
        app.chooseYourDog.hide();
        $("p").remove(".dog-name");
        app.instructions.append("<p class='dog-name'> Tap the arrows to move " + app.spritesAndEntities.player.name + "</p>");
        app.init();
    });
}//dog

$(function () {
    console.log("linked!");
    app.dog();
    app.init();

    // $(document).on("swiperight", function(e){ 
    //     e.preventDefault();
    //     console.log("right");
    //     app.spritesAndEntities.player.x +=10;
    
    // });
    // $(document).on("swipeleft", function (e) {
    //     e.preventDefault();
    //     console.log("left");
    //     app.spritesAndEntities.player.x -= 10;

    // });

});


