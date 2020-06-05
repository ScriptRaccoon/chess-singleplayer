import { TYPE } from "./Piece.js";
import { COLOR } from "./Piece.js";
import { Rook } from "./pieces/Rook.js";
import { Queen } from "./pieces/Queen.js";
import { Pawn } from "./pieces/Pawn.js";
import { Bishop } from "./pieces/Bishop.js";
import { King } from "./pieces/King.js";
import { Knight } from "./pieces/Knight.js";
import { Zebra } from "./pieces/Zebra.js";

export class PieceConfig {
    constructor(size) {
        this.size = size;
        this.map = new Map();
        this.posmap = new Map();
        this.previousPiece = null;
    }

    createConfig(gameString) {
        const size = this.size;
        gameString = gameString.replace(/ |\n/g, "");
        if (gameString.length !== size * size) {
            console.log(`Error: String (without spaces) has to be of length ${size * size}.`);
            return;
        }
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = x + y * size;
                const char = gameString[index];
                let piece;
                switch (char) {
                    case "R":
                        piece = new Rook(COLOR.BLACK);
                        break;
                    case "N":
                        piece = new Knight(COLOR.BLACK);
                        break;
                    case "B":
                        piece = new Bishop(COLOR.BLACK);
                        break;
                    case "K":
                        piece = new King(COLOR.BLACK);
                        break;
                    case "Q":
                        piece = new Queen(COLOR.BLACK);
                        break;
                    case "P":
                        piece = new Pawn(COLOR.BLACK);
                        break;
                    case "Z":
                        piece = new Zebra(COLOR.BLACK);
                        break;
                    case "r":
                        piece = new Rook(COLOR.WHITE);
                        break;
                    case "n":
                        piece = new Knight(COLOR.WHITE);
                        break;
                    case "b":
                        piece = new Bishop(COLOR.WHITE);
                        break;
                    case "k":
                        piece = new King(COLOR.WHITE);
                        break;
                    case "q":
                        piece = new Queen(COLOR.WHITE);
                        break;
                    case "p":
                        piece = new Pawn(COLOR.WHITE);
                        break;
                    case "z":
                        piece = new Zebra(COLOR.WHITE);
                        break;
                }
                if (piece) {
                    this.setPieceAt(piece, [x, y]);
                }
            }
        }
    }

    clear() {
        this.map.clear();
        this.posmap.clear();
    }

    hasCoord([x, y]) {
        return x >= 0 && y >= 0 && x < this.size && y < this.size;
    }

    get pieces() {
        return Array.from(this.map.values());
    }

    getPieceAt(pos) {
        return this.map.get(pos.toString());
    }

    hasPieceAt(pos) {
        return this.map.has(pos.toString());
    }

    setPieceAt(piece, pos) {
        this.map.set(pos.toString(), piece);
        this.posmap.set(piece, pos);
    }

    removePiece(piece) {
        const pos = this.posmap.get(piece);
        this.posmap.delete(piece);
        this.map.delete(pos.toString());
    }

    movePieceTo(piece, pos) {
        this.removePiece(piece);
        this.setPieceAt(piece, pos);
    }

    getKing(color) {
        return this.pieces.find((piece) => piece.type === TYPE.KING && piece.color === color);
    }

    checkPosition(color) {
        const king = this.getKing(color);
        return king.isThreatened(this) ? king.getPosition(this) : null;
    }
}
