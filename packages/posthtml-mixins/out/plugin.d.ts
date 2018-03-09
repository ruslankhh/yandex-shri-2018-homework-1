import { ITree } from 'posthtml';
export interface IOptions {
    delimiters: string[];
}
export default function posthtmlMixins(options?: IOptions): (tree?: ITree) => ITree;
