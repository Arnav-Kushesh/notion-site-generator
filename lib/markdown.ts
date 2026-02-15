
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function processMarkdown(content: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkHtml, { allowDangerousHtml: true })
        .process(content);
    return result.toString();
}
