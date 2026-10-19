/**
 * MetadataTable.tsx
 * Reusable table component for displaying EXIF metadata.
 * Shows detected metadata with clean styling that matches our Premium Paper UI.
 */

export interface MetadataEntry {
  key: string;
  value: string;
  label: string;
}

export interface MetadataTableProps {
  metadata: MetadataEntry[];
  showEdit?: boolean;
  className?: string;
}

export default function MetadataTable({
  metadata,
  showEdit = false,
  className = '',
}: MetadataTableProps) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-hairline bg-surface ${className}`}>
      <table className="w-full font-mono text-xs">
        <thead className="bg-surface-subtle text-ink/70 dark:text-chalk/70 border-b border-hairline uppercase tracking-wider">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Field</th>
            <th className="text-left px-4 py-3 font-semibold">Value</th>
            {showEdit && <th className="text-left px-4 py-3 font-semibold">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {metadata.map((entry, index) => (
            <tr key={index} className="hover:bg-hairline/20 transition-colors">
              <td className="px-4 py-3 text-ink/80 dark:text-chalk/80">{entry.label}</td>
              <td className="px-4 py-3 text-ink dark:text-chalk break-all">{entry.value}</td>
              {showEdit && (
                <td className="px-4 py-3">
                  <button className="text-ink dark:text-chalk hover:underline uppercase font-bold text-[11px]">
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
          {metadata.length === 0 && (
            <tr>
              <td colSpan={showEdit ? 3 : 2} className="px-4 py-8 text-center text-ink/40 dark:text-chalk/40">
                No metadata detected in this image
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
