import { useState } from 'react';
import { ChevronRight } from './icons';

function TreeNode({ node, level, onSelect, onCreate }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="mb-1">
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-notion-100"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button type="button" onClick={() => setOpen((prev) => !prev)} className="text-notion-500">
            <ChevronRight className={open ? 'rotate-90' : ''} />
          </button>
        ) : (
          <span className="inline-block w-4" />
        )}
        <button type="button" className="flex-1 text-left" onClick={() => onSelect(node._id)}>
          {node.title}
        </button>
        <button
          type="button"
          className="text-xs text-notion-500"
          onClick={() => onCreate(node._id)}
        >
          +
        </button>
      </div>
      {open &&
        node.children.map((child) => (
          <TreeNode
            key={child._id}
            node={child}
            level={level + 1}
            onSelect={onSelect}
            onCreate={onCreate}
          />
        ))}
    </div>
  );
}

export default function PageTree({ tree, onSelect, onCreate }) {
  return (
    <div>
      {tree.map((node) => (
        <TreeNode key={node._id} node={node} level={0} onSelect={onSelect} onCreate={onCreate} />
      ))}
    </div>
  );
}
