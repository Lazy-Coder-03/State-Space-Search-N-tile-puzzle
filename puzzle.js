class Puzzle {
    constructor(size, img) {
        this.size = size;
        this.tileSize = WIDTH / size;
        this.tiles = [];
        this.img = img || null;
        this.goalstate = [];
        this.oppositeMoves = {
            'left': 'right',
            'right': 'left',
            'up': 'down',
            'down': 'up'
        };
        this.maskedImages = {}; // Object to store masked images
        this.init();
    }

    init() {
        let num = 1;
        this.tiles = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let value = (i === this.size - 1 && j === this.size - 1) ? 0 : num++;
                this.tiles.push(new Tile(j, i, this.tileSize, value, this.img));
            }
        }
        this.goalstate = this.getState();
        this.createMaskedImages(); // Precompute the masked images
    }

    createMaskedImages() {
        if (!this.img) return;

        this.maskedImages = {};
        for (let num = 1; num <= this.size * this.size - 1; num++) {
            let imgX = (num - 1) % this.size * this.tileSize;
            let imgY = Math.floor((num - 1) / this.size) * this.tileSize;

            // Create a mask for the rounded corners
            let maskImage = createGraphics(this.tileSize, this.tileSize);
            maskImage.noStroke();
            maskImage.fill(255);
            maskImage.rect(0, 0, this.tileSize, this.tileSize, 10); // Draw rounded rectangle for mask

            // Create the masked image
            let maskedImg = createImage(this.tileSize, this.tileSize);
            maskedImg.copy(this.img, imgX, imgY, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            maskedImg.mask(maskImage);

            this.maskedImages[num] = maskedImg; // Store the masked image
        }
    }

    show() {
        this.tiles.forEach(tile => {
            if (tile.num !== 0) tile.showImg(this.maskedImages[tile.num]);
        });
    }

    update() {
        this.tiles.forEach(tile => tile.update());
    }
    findEmptyTile() {
        return this.tiles.find(tile => tile.num === 0);
    }

    getTile(i, j) {
        return this.tiles.find(tile => tile.col === i && tile.row === j);
    }

    getLegalBlankMoves() {
        let blankTile = this.findEmptyTile();
        let legalMoves = [];
        if (blankTile.col > 0) legalMoves.push('left');
        if (blankTile.col < this.size - 1) legalMoves.push('right');
        if (blankTile.row > 0) legalMoves.push('up');
        if (blankTile.row < this.size - 1) legalMoves.push('down');
        return legalMoves;
    }

    moveBlankTile(direction) {
        if (!this.getLegalBlankMoves().includes(direction)) {
            console.log('Illegal move:', direction);
            return false;
        }

        let blankTile = this.findEmptyTile();
        let targetTile = this.getTile(
            blankTile.col + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0),
            blankTile.row + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0)
        );

        if (targetTile) {
            //console.log(`Swapping tiles: Blank (${blankTile.col}, ${blankTile.row}) with (${targetTile.col}, ${targetTile.row})`);
            this.swapTiles(blankTile, targetTile);
            this.prevMove = direction;
            return true;
        }
        console.log('No target tile found for direction:', direction);
        return false;
    }

    moveTile(x, y) {
        let tileX = floor(x / this.tileSize);
        let tileY = floor(y / this.tileSize);
        let emptyTile = this.findEmptyTile();
        let direction = null;

        if (emptyTile.col === tileX && emptyTile.row === tileY) return;

        if (emptyTile.col === tileX) {
            direction = emptyTile.row > tileY ? 'up' : 'down';
        } else if (emptyTile.row === tileY) {
            direction = emptyTile.col > tileX ? 'left' : 'right';
        }

        if (direction && this.getLegalBlankMoves().includes(direction)) {
            this.moveBlankTile(direction);
        }
    }

    moveRandom() {
        let legalMoves = this.getLegalBlankMoves();
        if (this.prevMove) {
            let oppositeMove = this.oppositeMoves[this.prevMove];
            legalMoves = legalMoves.filter(move => move !== oppositeMove);
        }
        let randomMove = legalMoves[floor(random(legalMoves.length))];
        this.moveBlankTile(randomMove);
    }

    moveSequence(moves) {
        for (let move of moves) {
            if (!this.getLegalBlankMoves().includes(move)) {
                console.log('Illegal move:', move);
                return;
            }
            this.moveBlankTile(move);
        }
    }

    getState() {
        return Array.from({ length: this.size }, (_, i) =>
            Array.from({ length: this.size }, (_, j) => this.getTile(j, i).num)
        );
    }

    setState(state) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let tileNum = state[i][j];
                let tile = this.getTile(j, i);
                tile.num = tileNum;
                tile.x = j * this.tileSize;
                tile.y = i * this.tileSize;
            }
        }
    }

    swapTiles(tile1, tile2) {
        [tile1.col, tile2.col] = [tile2.col, tile1.col];
        [tile1.row, tile2.row] = [tile2.row, tile1.row];

        tile1.startAnimation(tile1.col * this.tileSize, tile1.row * this.tileSize);
        tile2.startAnimation(tile2.col * this.tileSize, tile2.row * this.tileSize);
    }

    findManhattanDistance() {
        return this.tiles.reduce((distance, tile) => {
            if (tile.num === 0) return distance;
            let realX = (tile.num - 1) % this.size;
            let realY = floor((tile.num - 1) / this.size);
            return distance + abs(tile.col - realX) + abs(tile.row - realY);
        }, 0);
    }

    isSolved() {
        return this.findManhattanDistance() === 0;
    }

    isAnimating() {
        return this.tiles.some(tile => tile.sliding);
    }
}



