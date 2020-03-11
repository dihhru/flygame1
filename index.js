sreenSize();
let can = document.getElementById("canvas");
can.onloadeddata = () => console.log("1");
let game = new Game();
let plane = new Plane(1);
let input = new InputHandler(plane, game);
let touch = new TouchScreen(plane, game);
let metro = new Metro();
metro.create(plane);
let promise = new Promise(function(resolve) {
  requestAnimationFrame(gameLoop);
  loadAudio(resolve);
});

promise.then(x => start());
