class Tile {
    constructor(i, j, size, num, img) {
        this.col = i;
        this.row = j;
        this.size = size;
        this.num = num;
        this.x = this.col * this.size+this.size/2;
        this.y = this.row * this.size + this.size / 2;
        this.targetX = this.x;
        this.targetY = this.y;
        this.sliding = false;
        this.img = img;
    }

    show() {
        rectMode(CENTER); // Set rectMode to CENTER
        fill(255);
        strokeWeight(2);
        stroke(0);
        rect(this.x, this.y, this.size, this.size, 10); // Centered rectangle

        fill(0);
        textSize(this.size / 2);
        textAlign(CENTER, CENTER);
        text(this.num, this.x, this.y); // Centered text
    }

    showImg(maskedImg) {
        if (this.img && this.num !== 0) {
            rectMode(CENTER); // Set rectMode to CENTER
            strokeWeight(2);
            stroke(0); // Added stroke to outline image
            rect(this.x, this.y, this.size, this.size, 10); // Centered rectangle
            image(maskedImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); // Adjusted image positioning
            if (showNumbers) {
                fill(255);
                textSize(this.size / 2);
                textAlign(CENTER, CENTER);
                text(this.num, this.x, this.y); // Centered text
            }
        } else {
            this.show(); // Show the tile as usual if no image is present
        }
    }

    startAnimation(targetX, targetY) {
        this.targetX = targetX + this.size / 2;
        this.targetY = targetY + this.size / 2;
        this.sliding = true;
    }

    update() {
        if (this.sliding) {
            this.x = lerp(this.x, this.targetX, SLIDE_SPEED);
            this.y = lerp(this.y, this.targetY, SLIDE_SPEED);
            if (abs(this.x - this.targetX) < 0.1 && abs(this.y - this.targetY) < 0.1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.sliding = false;
            }
        }
    }

    clone() {
        return new Tile(this.col, this.row, this.size, this.num, this.img);
    }
}
