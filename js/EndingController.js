import { Popup } from "./Popup.js";
import { COLOR } from "./Piece.js";
import { PieceConfig } from "./PieceConfig.js";
import { getEl } from "./helperFunctions.js";

export class EndingController {
    constructor(game) {
        this.game = game;
        this.popup = new Popup();
        this.addControls();
    }

    addControls() {
        getEl("restartImg").addEventListener("click", () => this.restart());
        getEl("drawImg").addEventListener("click", () => this.draw());
        getEl("resignImg").addEventListener("click", () => this.resign());
    }

    draw() {
        const status = this.game.status;
        if (status.isLocked) return;
        this.popup.show("Draw the game?", status, () => {
            status.outcome = "Players agreed to draw";
            this.game.notation.end(status.winner, status.outcome);
        });
    }

    resign() {
        const status = this.game.status;
        if (status.isLocked) return;
        this.popup.show("Resign the game?", status, () => {
            status.outcome = `${status.turn} resigns`;
            status.winner = status.turn === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
            this.game.notation.end(status.winner, status.outcome);
        });
    }

    restart() {
        const game = this.game;
        if (game.status.duringPromotion) return;
        this.popup.show("Restart the game?", game.status, () => {
            game.notation.clear();
            game.board.clear();
            game.history.clear();
            game.pieceConfig = new PieceConfig(game.pieceConfig.size);
            game.pieceConfig.createConfig(game.gameString);
            game.pieceController.initialize();
            game.status.initialize();
            game.start();
        });
    }
}
