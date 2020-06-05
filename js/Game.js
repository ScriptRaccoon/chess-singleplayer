import { Notation } from "./Notation.js";
import { Board } from "./Board.js";
import { PieceConfig } from "./PieceConfig.js";
import { History } from "./History.js";
import { Status } from "./Status.js";
import { EndingChecker } from "./EndingChecker.js";
import { EndingController } from "./EndingController.js";
import { HighlightController } from "./HighlightController.js";
import { PieceController } from "./PieceController.js";
import { createInfoText } from "./InfoText.js";

export class Game {
    constructor(gameString) {
        this.gameString = gameString;
        this.pieceConfig = new PieceConfig(8);
        this.pieceConfig.createConfig(gameString);
        this.board = new Board(8);
        this.history = new History(this);
        this.highlightController = new HighlightController(this);
        this.status = new Status();
        this.notation = new Notation();
        this.endingChecker = new EndingChecker(this);
        this.endingController = new EndingController(this);
        this.pieceController = new PieceController(this);
        createInfoText();
    }

    start() {
        this.addPieces();
        this.notation.start();
        this.status.showTurn();
        this.history.posmap.set(0.5, new Map(this.pieceConfig.posmap));
        this.history.addMoveControl(0.5);
    }

    addPiece(piece, pos) {
        this.pieceConfig.setPieceAt(piece, pos);
        this.board.add(piece.image, pos);
        this.pieceController.addDragFeature(piece);
    }

    removePiece(piece) {
        const pos = piece.getPosition(this.pieceConfig);
        this.pieceConfig.removePiece(piece);
        this.board.remove(piece.image, pos);
    }

    addPieces() {
        for (const piece of this.pieceConfig.pieces) {
            const pos = piece.getPosition(this.pieceConfig);
            this.board.add(piece.image, pos);
            this.pieceController.addDragFeature(piece);
        }
    }
}
