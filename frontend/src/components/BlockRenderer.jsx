export default function BlockRenderer({ block }) {
  if (!block) return null;

  switch (block.type) {
    case 'heading':
      return <h2 className="text-2xl font-semibold">{block.content?.text || ''}</h2>;
    case 'todo':
      return (
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={Boolean(block.content?.checked)} readOnly />
          <span>{block.content?.text || ''}</span>
        </label>
      );
    case 'code':
      return <pre className="rounded bg-notion-100 p-3 text-sm">{block.content?.text || ''}</pre>;
    case 'list':
      return (
        <ul className="list-disc pl-6">
          {(block.content?.items || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    default:
      return <p>{block.content?.text || ''}</p>;
  }
}
