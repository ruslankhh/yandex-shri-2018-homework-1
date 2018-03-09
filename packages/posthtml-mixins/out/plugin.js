'use strict';
const expandPlaceholder = require('expand-placeholder');
const { walk } = require('posthtml/lib/api');
const _ = require('lodash');

let delimiters;

function replaceExpression(str, attrs) {
	return expandPlaceholder.default(str, attrs, {
		opening: delimiters[0],
		closing: delimiters[1]
	});
}

function replaceExpressions(tree, attrs, content) {
	return walk.call(_.cloneDeep(tree), (node) => {
		if (typeof node === 'object') {
			if (node.attrs) {
				Object.keys(node.attrs).forEach((name) => {
					if (name.startsWith(delimiters[0]) && name.endsWith(delimiters[1])) {
						const attrName = name.slice(
							delimiters[0].length,
							name.length - delimiters[1].length
						);
						if (attrs[attrName]) {
							node.attrs[replaceExpression(name, attrs)] = '';
						}
						delete node.attrs[name];
					} else {
						node.attrs[name] = replaceExpression(node.attrs[name], attrs);
					}
				});
			}
			if (node.tag === 'content') {
				node = {
					tag: false,
					content: content || node.content || [],
					attrs: null
				};
			}
		}
		else if (typeof node === 'string') {
			node = replaceExpression(node, attrs);
		}
		return node;
	});
}

function makeMixinReference(node, storage) {
	const name = node.attrs.name;
	const define = storage[name];

	if (!define) {
		throw new Error(`The Mixin with name "${name}" not exist.`);
	}

	const attrs = {
		...define.attrs,
		...node.attrs
	};

	return {
		tag: false,
		content: replaceExpressions(define.content, attrs, node.content),
		attrs: null
	};
}

function posthtmlMixins(options) {
	const storage = {};

	options = {
		delimiters: ['{{', '}}'],
		...options
	};

	delimiters = options.delimiters;

	return (tree) => {
		tree.match([{ tag: 'define-mixin' }, { tag: 'mixin' }], (node) => {
			if (!node.attrs || (node.attrs && !node.attrs.name)) {
				return node;
			}

			const name = node.attrs.name;

			if (node.tag === 'define-mixin') {
				storage[name] = node;

				return {
					tag: false,
					content: [],
					attrs: null
				};
			}
			if (node.tag === 'mixin') {
				if (!node.content && !storage[name]) {
					throw new Error(`The Mixin with name "${name}" not exist`);
				}

				return makeMixinReference(node, storage);
			}
		});

		return tree;
	};
}

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = posthtmlMixins;
