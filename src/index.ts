import { Frost, WorkAttributes } from '@poetapp/frost-client';
import * as PromptSync from 'prompt-sync';

const config = {
    host: 'https://api.frost.po.et', // required
    timeout: 10 // default 10 seconds
}

class CLI {

    private frost_token: string;
    private frost: Frost;
    private p: PromptSync.Prompt;

    constructor() {
        this.frost = new Frost(config);
        this.frost_token = "";
        this.p = PromptSync();
        this.frost_token = this.p("Enter your Frost API token: ", {echo: ''});
    }

    public promptCreateWork() {
        console.log("Create a new Work..");
        const work: WorkAttributes = {
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

    private async uploadWork(work: WorkAttributes) {
        try {
            await this.frost.createWork(this.frost_token, work).then(() => {
                console.log("Work submitted successfully!\n");
            }).catch((reason) => {
                console.log(reason);
            });
        } catch(e) {
            console.log("Error while submitting work: ");
            console.log(e);
        }
    }

    private async getWorks() {
        try {
            this.frost.getWorks(this.frost_token).then((works) => {
                console.log("=============== Your works ===============");
                console.log(works);
                return this.promptActivity();
            }).catch((reason) => {
                console.log(reason);
            });
        } catch(e) {
            console.log("Error while getting works: ");
            console.log(e);
        }
    }

    public promptActivity() {
        switch(this.p("Enter 'l' to list all works or 'p' to post a new work or 'q' to quit: ")) {
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

const cli: CLI = new CLI();

cli.promptActivity();