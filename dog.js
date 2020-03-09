class Game {
  constructor() {
    this.scores = notesPositions.length;
    this.isStarted = false;
    this.level = -1;
    this.notesPositions = null;
    this.activeNote = -1;
  }
  speed() {
    document.getElementById("range").value = 10 + 7 * this.level;
  }
  win() {
    let _this = this;
    let img = document.getElementById(authors[game.level]);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    let x = 250;
    let int = setInterval(function() {
      x--;
      if (x === 80) {
        clearInterval(int);
        setTimeout(() => {
          _this.buildLevel();
          setTimeout(() => (_this.isStarted = true), 2000);
        }, 2000);
      }
      ctx.clearRect(0, 0, 1200, 400);
      ctx.drawImage(img, 500, x, 200, 300);
    }, 5);
  }
  buildLevel() {
    game.notesPositions = null;
    game.activeNote = -1;
    this.level++;
    if (this.level == 4) {
      this.level = 0;
    }
    game.notesPositions = JSON.parse(
      JSON.stringify(notesPositions[game.level])
    );
    game.scores = notesPositions[game.level].length;
    let root = document.getElementById("root");
    let pannel = document.getElementById("pannel");
    root.removeChild(pannel);
    let oldPannel = document.getElementById("mozart_pannel");
    let newPannel = oldPannel.cloneNode();
    newPannel.id = "pannel";
    newPannel.style.display = "none";
    newPannel.style.width = "3600px";
    newPannel.className = "pannel";
    root.appendChild(newPannel);
    this.speed();
  }
  togglePause() {
    console.log(notesPositions);
    plane.speed = 0;
  }
  detectCollision(plane, note, index) {
    let bottomOfplane = plane.position.y + plane.size;
    let topOfplane = plane.position.y;
    let topOfObject = note[1];
    let bottomOfObject = note[1] + 110;
    let leftSideOfObject = note[0];
    if (
      bottomOfplane >= topOfObject &&
      topOfplane <= bottomOfObject &&
      plane.position.x + 50 >= leftSideOfObject &&
      note[2] !== 0
    ) {
      game.scores--;
      game.notesPositions[index][2] = 0;
      uniq.map((x, index) => {
        let song = document.getElementById("s" + index);
        song.currentTime = 0;
        song.pause();
      });
      return true;
    } else {
      return false;
    }
  }
  drawNotes() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    game.notesPositions.map(function(note) {
      if (note[2] === 0) {
        return;
      }
      let nota = document.getElementById(note[3]);
      let img = nota;
      ctx.drawImage(img, note[0], note[1], 40, 75);
    });
  }
}

class Plane {
  constructor(speed) {
    this.image = "images/plane.png";
    this.speed = speed;
    this.position = { x: 0, y: 150 };
    this.size = 100;
    this.distance = 0;
  }
  moveDown() {
    this.position.y = this.position.y + 15;
  }
  moveUp() {
    this.position.y = this.position.y - 15;
  }
  update() {
    let range = document.getElementById("range").value;
    this.distance = 0.05 * range;
    if (game.isStarted === false) {
      return;
    }
    this.position.x += this.distance;
    if (this.position.x >= 1200) {
      game.isStarted = false;
      this.position.x = 0;
      if (game.scores > 3) {
        game.isStarted = true;
        game.activeNote = -1;
        return;
      }
      game.win();
    } else {
      this.draw();
    }
  }
  crash() {
    let audio = document.createElement("audio");
    audio.src = "sounds/crash_sound.wav";
    audio.play();
  }
  draw() {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    var ctx = canvas.getContext("2d");
    var image = document.getElementById("plane");
    let pannel = document.getElementById("pannel");
    let y = this.position.y;
    ctx.drawImage(pannel, 0, 0, 3200, 700);
    ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform matrix as it is cumulative
    ctx.translate(-this.position.x, 0);
    ctx.drawImage(image, this.position.x + 100, this.position.y, 100, 100);
    game.drawNotes();
    game.notesPositions.map((note, index) => {
      if (game.activeNote !== index && index >= game.activeNote) {
        let n = game.detectCollision(plane, note, index);
        if (n) {
          game.activeNote = index;
          let soundId = sounds[game.level][index];
          let id = uniq.indexOf(soundId);
          let audio = document.getElementById("s" + id);
          audio.currentTime = 0;
          audio.play();
        }
      }
    });
  }
}
class InputHandler {
  constructor(plane, game) {
    document.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 38:
          plane.moveUp();
          break;
        case 40:
          plane.moveDown();
          break;
        case 32:
          var value = game.isStarted;
          game.isStarted = !value;
          console.log(game);
          break;
        case 13:
          var value = game.isStarted;
          game.isStarted = !value;
          break;
      }
    });
  }
}
