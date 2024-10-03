interface Action {
    undo(): void;
    redo(): void;
}

export class History {
    private actions: Action[] = [];

    constructor() {}

    addAction(action: Action): void {
        this.actions.push(action);
    }

    addFence(): void {
        //
    }

    undo(): void {
        const action = this.actions.pop();

        if (!action) {
            return;
        }

        action.undo();
    }

    redo(): void {
        const action = this.actions[this.actions.length - 1];

        if (!action) {
            return;
        }

        action.redo();
    }
}
