import { getEl } from "./helperFunctions.js";

const popup = getEl("popup");
const question = getEl("question");
const yesButton = getEl("yesButton");
const cancelButton = getEl("cancelButton");

export class Popup {
    show(string, status, callback) {
        status.viewMode = true;
        question.innerHTML = string;
        popup.style.display = "flex";
        cancelButton.onclick = () => this.hide(status);
        yesButton.onclick = () => {
            this.hide(status);
            callback();
        };
    }

    hide(status) {
        status.viewMode = false;
        question.innerHTML = "";
        popup.style.display = "none";
    }
}
