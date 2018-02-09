"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const frost_client_1 = require("@poetapp/frost-client");
const PromptSync = require("prompt-sync");
const config = {
    host: 'https://api.frost.po.et',
    timeout: 10 // default 10 seconds
};
class CLI {
    constructor() {
        this.frost = new frost_client_1.Frost(config);
        this.frost_token = "";
        this.p = PromptSync();
        this.frost_token = this.p("Enter your Frost API token: ", { echo: '' });
    }
    promptCreateWork() {
        console.log("Create a new Work..");
        const work = {
            name: this.p("\tWork name: "),
            datePublished: new Date(Date.now()).toISOString(),
            dateCreated: new Date(this.p("\tDate created: ").toString()).toISOString(),
            author: this.p("\tAuthor: "),
            tags: this.p("\tComma separated tags: "),
            content: this.p("\tContent (copy and paste text): ")
        };
        this.uploadWork(work);
        return this.promptActivity();
    }
    uploadWork(work) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.frost.createWork(this.frost_token, work).then(() => {
                    console.log("Work submitted successfully!");
                }).catch((reason) => {
                    console.log(reason);
                });
            }
            catch (e) {
                console.log("Error while submitting work: ");
                console.log(e);
            }
        });
    }
    getWorks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.frost.getWorks(this.frost_token).then((works) => {
                    console.log("=============== Your works ===============");
                    console.log(works);
                    return this.promptActivity();
                });
            }
            catch (e) {
                console.log("Error while getting works: ");
                console.log(e);
            }
        });
    }
    promptActivity() {
        switch (this.p("Enter 'l' to list all works or 'p' to post a new work or 'q' to quit: ")) {
            case 'l':
                this.getWorks();
                break;
            case 'q':
                return;
            case 'p':
                this.promptCreateWork();
                break;
        }
    }
}
const cli = new CLI();
cli.promptActivity();
