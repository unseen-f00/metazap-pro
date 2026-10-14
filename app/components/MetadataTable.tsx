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
    <div className={`overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
          <tr>
            <th className="text-left px-4 py-3">Field</th>
            <th className="text-left px-4 py-3">Value</th>
            {showEdit && <th className="text-left px-4 py-3">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {metadata.map((entry, index) => (
            <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{entry.label}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono">{entry.value}</td>
              {showEdit && (
                <td className="px-4 py-3">
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-medium">
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
          {metadata.length === 0 && (
            <tr>
              <td colSpan={showEdit ? 3 : 2} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                No metadata detected in this image
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
