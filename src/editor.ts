import { History } from './history';
import { Rope } from './rope';

export class Editor {
    private _content: Rope;
    private _history: History = new History();

    constructor(text: string) {
        this._content = new Rope(text);
    }

    public get content(): string {
        return this._content.toString();
    }

    insert(fromPosition: number, input: string): void {
        this._insert(fromPosition, input);

        const toPosition = fromPosition + input.length;

        this._history.addAction({
            undo: () => this._delete(fromPosition, toPosition),
            redo: () => this.insert(toPosition, input),
        });
    }

    delete(fromPosition: number, toPosition: number): string {
        const deleted = this._delete(fromPosition, toPosition);

        console.log('deleted', deleted);

        this._history.addAction({
            undo: () => this._insert(fromPosition, deleted),
            redo: () => this.delete(fromPosition, toPosition),
        });

        return deleted;
    }

    undo(): void {
        this._history.undo();
    }

    redo(): void {
        this._history.redo();
    }

    private _delete(fromPosition: number, toPosition: number): string {
        return this._content.remove(fromPosition, toPosition);
    }

    private _insert(position: number, inputString: string): void {
        this._content.insert(position, inputString);
    }
}
