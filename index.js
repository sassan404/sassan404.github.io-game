
let speed = 2;
window.onload = function(){
    let ballPosition = document.getElementById('ball').style;
    let container = document.querySelector('#game-container').getBoundingClientRect();
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let angle = null;
 
    let playerPosition = document.getElementById('player').style;

    ballPosition.top = screenHeight/2-10 + 'px';
    ballPosition.left = screenWidth/2-10 + 'px';

    let evtCoordinates = null;
    playerPosition.left = screenWidth/2-10 + 'px';

    function handleEvent(evt){
        evt.preventDefault()
        evtCoordinates = evt.x;
    }

    window.addEventListener('mousedown', function(evt){
        evtCoordinates = evt.x;
        window.addEventListener('mousemove', handleEvent);
    })    
    window.addEventListener('mouseup', function(){
        window.removeEventListener('mousemove', handleEvent);
    });

    window.addEventListener('touchstart', function(evt){
        evt.preventDefault()
        evtCoordinates = evt.x;
        window.addEventListener('touchmove', handleEvent);
    })    
    window.addEventListener('touchend', function(){
        evt.preventDefault()
        window.removeEventListener('touchmove', handleEvent);
    });


    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 37:
                evtCoordinates = 1
                break;
            case 39:
                evtCoordinates = window.innerWidth;
                break;
        }
    });



    setInterval(
        function(){
            let player = document.querySelector('#player').getBoundingClientRect();

            if(evtCoordinates){
                movePlayer(playerPosition, evtCoordinates, player, container);
                evtCoordinates = null;
            }
            let ball = document.querySelector('#ball').getBoundingClientRect();

            if (!angle){
                angle = (Math.random() * 360)-180;
            }
            angle = moveBall(angle, ball, container, ballPosition);

        }, 0.1);


};


movePlayer = function(playerPosition, evtPostion, playerBoundaries, container){
    let xPostion = getPxValue(playerPosition.left);
    if(evtPostion > xPostion && playerBoundaries.right+10<=container.right){
        playerPosition.left = xPostion+10 + 'px';
    } else if(evtPostion < xPostion && playerBoundaries.left-10>=container.left){
        playerPosition.left = xPostion-10 + 'px';
    }
}

getPxValue = function(px){
    return parseFloat(px.substring(0, px.length-2));
}

getPercentageValue = function(percentage){
    return parseFloat(percentage.substring(0, percentage.length-2));
}

percentageToPx = function(percentage) {
    return screenWidth*(percentage/100);
}

pxToPercentage = function(px){
    return (px/screenWidth)*100;
}

newBallPosition = function(angle, currentPosition){
    let angleInRadian = angle * Math.PI/180;
    return {
        right: (currentPosition.right + speed*Math.cos(angleInRadian)),
        left: ((currentPosition.left) + speed*Math.cos(angleInRadian)),
        top: ((currentPosition.top) - speed*Math.sin(angleInRadian)),
        bottom: (currentPosition.bottom - speed*Math.sin(angleInRadian))
    };
};


getNextAngle = function(angle, newBallPosition, boundary){
    if(newBallPosition.right>boundary.right){
        if(angle>0 && angle<90) return 180 - angle;
        if(angle<0 && angle>-90) return - angle - 180;
    }
    if(newBallPosition.left<boundary.left){
        if(angle>90) return 180 - angle;
        if(angle<-90) return - angle - 180;
    }
    if(newBallPosition.top<boundary.top && angle>0){
        return - angle;
    }
    if(newBallPosition.bottom>boundary.bottom && angle<0){
        return - angle;
    }
    return angle;
};

moveBall = function(angle, ballPosition, container, setBallPosition){
 
    let nextBallPosition = newBallPosition(angle,ballPosition);             
    let newAngle = getNextAngle(angle, nextBallPosition, container);
    if(newAngle != angle){
        nextBallPosition = newBallPosition(newAngle,ballPosition);
    }
    setBallPosition.left = nextBallPosition.left + 'px';
    setBallPosition.top = nextBallPosition.top + 'px';
    return newAngle;
}

