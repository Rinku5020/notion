import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { fetchPages, fetchPage, createPage } from './lib/api';

const EMPTY_PAGE = {
  _id: null,
  title: 'Untitled',
  parentId: null,
};

function App() {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(EMPTY_PAGE);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPages(searchQuery)
      .then(setPages)
      .catch(() => setStatus('Unable to load pages.'));
  }, [searchQuery]);

  const handleSelect = async (pageId) => {
    try {
      const page = await fetchPage(pageId);
      setActivePage(page);
    } catch (error) {
      setStatus('Unable to load page.');
    }
  };

  const handleCreate = async (parentId = null) => {
    try {
      const page = await createPage({ title: 'Untitled', parentId });
      setPages((prev) => [page, ...prev]);
      setActivePage(page);
    } catch (error) {
      setStatus('Unable to create page.');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        pages={pages}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onSearch={setSearchQuery}
      />
      <main className="flex-1 overflow-y-auto bg-white">
        {status && <div className="border-b border-notion-100 p-3 text-sm text-red-500">{status}</div>}
        <Editor page={activePage} onTitleChange={setActivePage} />
      </main>
    </div>
  );
}

export default App;
