import { useMemo, useState } from 'react';
import PageTree from './PageTree';

function buildTree(pages, parentId = null) {
  return pages
    .filter((page) => page.parentId === parentId)
    .map((page) => ({
      ...page,
      children: buildTree(pages, page._id),
    }));
}

export default function Sidebar({ pages, onSelect, onCreate, onSearch }) {
  const [query, setQuery] = useState('');

  const filteredPages = useMemo(() => pages, [pages]);

  const tree = useMemo(() => buildTree(filteredPages), [filteredPages]);

  const handleSearch = (value) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <aside className="flex w-72 flex-col border-r border-notion-100 bg-notion-50 p-4">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Notion Clone</h1>
        <p className="text-xs text-notion-600">Your workspace</p>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          className="w-full rounded-md border border-notion-200 bg-white px-3 py-2 text-sm"
          placeholder="Search pages"
          value={query}
          onChange={(event) => handleSearch(event.target.value)}
        />
        <button
          className="rounded-md bg-notion-900 px-3 py-2 text-xs font-semibold text-white"
          onClick={() => onCreate(null)}
          type="button"
        >
          New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PageTree tree={tree} onSelect={onSelect} onCreate={onCreate} />
      </div>
    </aside>
  );
}
