import { getEl, createEl } from "./helperFunctions.js";

export const boardDiv = getEl("boardDiv");
const rotateImg = getEl("rotateImg");

export class Board {
    constructor(size) {
        this.size = size;
        this.squareMap = new Map();
        this.rotated = false;
        this.createSquares();
        this.addControls();
    }

    createSquares() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const className = (x + y) % 2 === 0 ? "square square-light" : "square square-dark";
                const square = createEl("div", className, boardDiv);
                this.squareMap.set([x, y].toString(), square);
            }
        }
    }

    getSquareAt(pos) {
        return this.squareMap.get(pos.toString());
    }

    clear() {
        for (const square of this.squareMap.values()) {
            square.innerHTML = "";
        }
    }

    addControls() {
        rotateImg.addEventListener("click", () => this.rotate());
    }

    rotate() {
        boardDiv.classList.toggle("board-rotated");
        this.rotated = !this.rotated;
    }

    add(pieceImg, pos) {
        this.getSquareAt(pos).appendChild(pieceImg);
    }

    remove(pieceImg, pos) {
        this.getSquareAt(pos).removeChild(pieceImg);
    }
}
