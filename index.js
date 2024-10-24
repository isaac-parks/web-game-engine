function createVec2D(x, y) {
  return new Vector2D(x, y);
}

function newEmptyVec() {
  return new Vector2D(0, 0);
}

class Vector2D {
  constructor(x = 1, y = 1) {
    this.x = x;
    this.y = y;
  }
  translate(t) {
    console.log("t vector:", t.x, t.y);
    this.x += t.x;
    this.y += t.y;

    console.log(`translated (new x, new y): ${this.x}, ${this.y}`);
  }
  isEmpty() {
    return this.x === 0 && this.y === 0;
  }
}

function createActor(size) {
  return new Actor(size);
}

class Actor {
  constructor(size) {
    // TODO give actor an ID.
    this.gameMap = null;
    this.size = size;
    this.location = newEmptyVec();
    this.wasUpdated = false; // used to determine if we should redraw the actor
  }
  moveDefault() {
    // TODO give actors a default "move speed" that can be called and then they move automatically
  }
  move(vec) {
    let currentLocation = createVec2D(this.location.x, this.location.y);
    this.location.translate(vec);
    if (!this.gameMap.checkBoundry(this.location.x, this.location.y)) {
      this.location.translate(currentLocation);
    }
  }
  setSize(size) {
    this.size = size;
  }
  setLocation(loc) {
    this.location = loc;
  }
  _loadToMap(gameMap) {
    this.gameMap = gameMap;
    return this; // return copy of the actor for convenience
  }
}

// Represents the space where play is valid
class Grid {
  constructor() {
    this.gridspace = [];
  }
  createGrid(xbound, ybound) {
    if (this.gridspace?.length) {
      return;
    }
    this.gridspace = [];
    for (let y = 0; y < ybound; y++) {
      this.gridspace[y] = new Array(xbound).fill(0);
    }
    this.width = this.gridspace[0].length;
    this.height = this.gridspace.length;
  }
  drawSquare(spaceVector2D, locationVector2D) {
    if (!locationVector2D) {
      locationVector2D = createVec2D(1, 1);
    }
    const xend = locationVector2D.x + spaceVector2D.x - 1;
    const yend = locationVector2D.y + spaceVector2D.y - 1;

    if (!this.checkBoundry(xend, yend)) {
      throw new Error("Cannot draw outside of the grid");
    }

    for (let y = locationVector2D.y; y <= yend; y++) {
      for (let x = locationVector2D.x; x <= xend; x++) {
        this.drawPixel(createVec2D(x, y));
      }
    }
  }
  clearSquare(spaceVector2D, locationVector2D) {
    if (!locationVector2D) {
      locationVector2D = createVec2D(1, 1);
    }
    const xend = locationVector2D.x + spaceVector2D.x - 1;
    const yend = locationVector2D.y + spaceVector2D.y - 1;

    if (!this.checkBoundry(xend, yend)) {
      throw new Error("Cannot draw outside of the grid");
    }

    for (let y = locationVector2D.y; y <= yend; y++) {
      for (let x = locationVector2D.x; x <= xend; x++) {
        this.erasePixel(createVec2D(x, y));
      }
    }
  }
  checkBoundry(newX, newY) {
    if (newY > this.height || newX > this.width) {
      return false;
    }

    return true;
  }
  drawPixel(vec2d) {
    // subtracting 1 because the grid uses 1 based indexing
    this.gridspace[vec2d.y - 1][vec2d.x - 1] = 1;
  }
  erasePixel(vec2d) {
    this.gridspace[vec2d.y - 1][vec2d.x - 1] = 0;
  }
  log() {
    console.table(this.gridspace);
  }
}

function createGameMap() {
  // TODO new gamemap has config from GameMapConfig class
  const map = new GameMap();
  return map;
}

class GameMap extends Grid {
  constructor() {
    super();
    this.actors = [];
  }
  setBounds(x, y) {
    this.createGrid(x, y);
  }
  createDefaultActor() {} // TODO
  addActor(actor) {
    this.actors.push(actor);
  }
  placeActor(actor, loc = newEmptyVec()) {
    if (!this.checkBoundry(loc.x, loc.y)) {
      throw new Error("Actor cannot be placed outside of grid");
    }
    actor.setLocation(loc);
    this.addActor(actor._loadToMap(this));

    return actor;
  }
  update() {
    this.drawActors();
  }
  drawActors() {
    for (let actor of this.actors) {
      console.log(actor);
      this.clearSquare(actor.size, actor.location);
      this.drawSquare(actor.size, actor.location);
    }
  }
}
