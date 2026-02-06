import { useEffect, useMemo, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlock from '@tiptap/extension-code-block';

import useAutoSave from '../hooks/useAutoSave';
import { fetchBlocks, saveBlocks, updatePage } from '../lib/api';

const SLASH_COMMANDS = [
  { label: 'Text', command: 'text' },
  { label: 'Heading 1', command: 'h1' },
  { label: 'Heading 2', command: 'h2' },
  { label: 'Bullet List', command: 'bullet' },
  { label: 'Todo', command: 'todo' },
  { label: 'Code Block', command: 'code' },
];

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

const nodeTypeMap = {
  paragraph: 'text',
  heading: 'heading',
  bulletList: 'list',
  taskList: 'todo',
  codeBlock: 'code',
};

function blocksToDoc(blocks) {
  if (!blocks || blocks.length === 0) return EMPTY_DOC;
  return {
    type: 'doc',
    content: blocks.map((block) => block.content),
  };
}

function docToBlocks(doc) {
  const content = doc?.content ?? [];
  return content.map((node, index) => ({
    type: nodeTypeMap[node.type] || 'text',
    content: node,
    order: index,
  }));
}

export default function Editor({ page, onTitleChange }) {
  const [blocks, setBlocks] = useState([]);
  const [showSlash, setShowSlash] = useState(false);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        listItem: false,
        codeBlock: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      ListItem,
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlock,
    ],
    content: EMPTY_DOC,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor || !page?._id) return;

    fetchBlocks(page._id)
      .then((data) => {
        setBlocks(data);
        editor.commands.setContent(blocksToDoc(data));
      })
      .catch(() => {
        setBlocks([]);
        editor.commands.setContent(EMPTY_DOC);
      });
  }, [editor, page?._id]);

  useEffect(() => {
    if (!editor) return;

    const handler = ({ editor: editorInstance }) => {
      const json = editorInstance.getJSON();
      setBlocks(docToBlocks(json));
      const { from } = editorInstance.state.selection;
      const text = editorInstance.state.doc.textBetween(from - 1, from, '\n');
      setShowSlash(text === '/');
    };

    editor.on('update', handler);
    return () => editor.off('update', handler);
  }, [editor]);

  const handleTitleChange = (event) => {
    onTitleChange((prev) => ({ ...prev, title: event.target.value }));
  };

  useAutoSave(page?.title, (title) => {
    if (!page?._id) return;
    updatePage(page._id, { title }).catch(() => null);
  }, 600);

  useAutoSave(blocks, async (nextBlocks) => {
    if (!page?._id) return;
    setSaving(true);
    try {
      await saveBlocks(page._id, nextBlocks);
    } finally {
      setSaving(false);
    }
  }, 900);

  const handleSlashCommand = (command) => {
    if (!editor) return;
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .deleteRange({ from: from - 1, to: from })
      .run();

    switch (command) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'todo':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
    setShowSlash(false);
  };

  const slashMenu = useMemo(() => {
    if (!showSlash) return null;
    return (
      <div className="absolute left-0 top-12 z-10 w-56 rounded-md border border-notion-200 bg-white shadow">
        {SLASH_COMMANDS.map((item) => (
          <button
            key={item.command}
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-notion-50"
            onClick={() => handleSlashCommand(item.command)}
          >
            <span>{item.label}</span>
            <span className="text-xs text-notion-500">/{item.command}</span>
          </button>
        ))}
      </div>
    );
  }, [showSlash]);

  return (
    <section className="relative mx-auto max-w-5xl px-10 py-8">
      <div className="flex items-center justify-between">
        <input
          className="w-full border-none text-4xl font-semibold outline-none"
          value={page?.title || ''}
          onChange={handleTitleChange}
          placeholder="Untitled"
        />
        <span className="ml-4 text-xs text-notion-500">{saving ? 'Saving...' : 'Saved'}</span>
      </div>
      <div className="relative mt-6">
        {slashMenu}
        <EditorContent editor={editor} />
      </div>
    </section>
  );
}
