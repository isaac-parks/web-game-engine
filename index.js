// 1. create a 2d space
// 2. be able to draw stuff in the 2d space 
// 2. be able to move in the 2d space

// Represents a place in the grid
class Vector2D {
    constructor(x, y) {
        x = x ? x : 1;
        y = y ? y : 1;
        this.x = x
        this.y = y
    }
}

// Represents a thing that is in the grid (could be player, enemy, or an inanimate object)
class Actor {
    constructor() {

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
        this.gridspace = []
        for (let y = 0; y < ybound; y++) {
            this.gridspace[y] = new Array(xbound).fill(0)
        }
        this.width = this.gridspace[0].length
        this.height = this.gridspace.length
    }
    drawSquare(spaceVector2D, locationVector2D) {
        if (!locationVector2D) {
            locationVector2D = new Vector2D(1, 1)
        }
        const yend = locationVector2D.y + spaceVector2D.y - 1
        const xend = locationVector2D.x + spaceVector2D.x - 1
        if (yend > this.height || xend > this.width) {
            throw new Error('Cannot draw outside of the grid')
        }
        for (let y = locationVector2D.y; y <= yend; y++) {
            for (let x = locationVector2D.x; x <= xend; x++) {
                this.drawPixel(new Vector2D(x, y))
            }
        }
    }
    drawPixel(vec2d) {
        // subtracting 1 because the grid uses 1 based indexing
         this.gridspace[vec2d.y - 1][vec2d.x - 1] = 1;
    }
    erasePixel(vec2d) {
        this.gridspace[vec2d.y - 1][vec2d.x - 1] = 0;
    }
    logGrid() {
        console.table(this.gridspace)
    }
}

class GameMap extends Grid {
    constructor() {
        super();
    }
}