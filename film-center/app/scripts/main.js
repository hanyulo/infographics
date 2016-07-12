console.log('\'Allo \'Allo!');

// let canvideo = new CanvasVideo('testCanvas', 44, 40);
// canvideo.playClip('./images/coin-sprite-animation-sprite-sheet.png', 10, 10, 5, false, null, null);

let lastScrollTop = 0;
let scrollDirection = 1;
$(window).scroll(function(event) {
    let st = $(this).scrollTop();
    if (st > lastScrollTop) {
        // downscroll code
        scrollDirection = 1;
    } else {
        // upscroll code
        scrollDirection = -1;
    }
    lastScrollTop = st;
});


let canvideo = new CanvasVideo('testCanvas', 2000, 1126);
canvideo.drawImage('./images/daan.jpg');

// let canvideo = new CanvasVideo('testCanvas', 1000, 563);
// canvideo.playClip('./images/myvideo.jpg', 6, 12, 5, false, 0, () => {
//     canvideo.drawImage('./images/endImage.jpg')
// });

let cvProcess1 = new CanvasVideo('process1', 1000, 563);
cvProcess1.playClip('./images/process1.jpg', 6, 47, 15, false, null, null);


let cvProcess2 = new CanvasVideo('process2', 1000, 563);
cvProcess2.playClip('./images/process2.jpg', 6, 47, 15, false, null, null);

let cvProcess3 = new CanvasVideo('process3', 1000, 563);
cvProcess3.playClip('./images/process3.jpg', 6, 47, 15, false, null, null);

let cvProcess4 = new CanvasVideo('process4', 1000, 563);
cvProcess4.playClip('./images/process4.jpg', 6, 47, 15, false, null, null);


// init controller

var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
        triggerHook: 'onLeave',
        duration: '200%'
    }
});


// google earth
new ScrollMagic.Scene({
        triggerElement: '#g-earth',
        triggerHook: 'onLeave'
    })
    .setPin('#g-earth canvas')
    .reverse(true)
    .on('start', function() {
        console.log('on START!!!')
        let isReverse = (scrollDirection > 0) ? false : true;
        canvideo.playClip('./images/myvideo.jpg', 6, 12, 5, isReverse, 0, null);
        // canvideo.playClip('./images/daan_taiwan.jpg', 6, 43, 60, false, 0, () => {
        //     canvideo.drawImage('./images/taiwan.jpg')
        // });
    })
    .setTween('#g-earth .description', {
        top: '0%',
        ease: Linear.easeNone
    })
    .addTo(controller);



// build scenes for the restoration process
for (let i = 1; i <= 4; i++) {
    new ScrollMagic.Scene({
            triggerElement: '#restorationBox' + i,
            duration: '100%'
        })
        .setPin('#restorationBox' + i)
        .setTween('#restorationBox' + i + ' > .description', {
            top: '0%',
            ease: Linear.easeNone
        })
        .addTo(controller);
}



// var stage = new createjs.Stage('myCanvas');
// var shape = new createjs.Shape();
// shape.graphics.beginFill('red').drawRect(0, 0, 1000, 563);
// stage.addChild(shape);
// stage.update();
// var ss = new createjs.SpriteSheet({
//     frames: {
//         width: 1000,
//         height: 563,
//         numFrames: 12
//     },
//     animations: {
//         run: [0, 50],
//         jump: [12, 0, 'run']
//     },
//     images: ['./images/myvideo.jpg']
// });
//
// var sprite = new createjs.Sprite(ss);
// sprite.scaleY = sprite.scaleX = 0.2;
// stage.addChild(sprite);
// sprite.gotoAndPlay('run');
//
// sprite.on('click', function() {
//     sprite.gotoAndPlay('run');
// });
//
// createjs.Ticker.on('tick', stage);