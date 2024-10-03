import { Editor } from './editor';
import { readFile, writeFile } from 'node:fs/promises';

async function init() {
    const file = 'test.txt';

    try {
        const data = await readFile(file, { encoding: 'utf8' });

        const editor = new Editor(data);

        editor.insert(editor.content.length, ' World');
        editor.insert(editor.content.length, '!');

        // await writeFile(file, editor.content);
    } catch (err) {
        console.log(err);
    }
}

init();
