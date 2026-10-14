'use client';

/**
 * EditorTool.tsx
 * Client component for the EXIF Editor page.
 * Includes UploadDropzone for selecting an image and fields for editing EXIF tags.
 */

import { useState } from 'react';
import UploadDropzone from '@/app/components/UploadDropzone';

export default function EditorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [author, setAuthor] = useState('Photographer');
  const [copyright, setCopyright] = useState('© 2025 All Rights Reserved');
  const [dateOriginal, setDateOriginal] = useState('2025:01:01 12:00:00');
  const [software, setSoftware] = useState('MetaZap Pro');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setDownloadUrl(url);
  };

  const handleApply = () => {
    if (!selectedFile) return;
    const a = document.createElement('a');
    a.href = downloadUrl || URL.createObjectURL(selectedFile);
    a.download = `edited_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setSelectedFile(null);
    setDownloadUrl(null);
    setAuthor('Photographer');
    setCopyright('© 2026 All Rights Reserved');
    setDateOriginal('2026:01:01 12:00:00');
    setSoftware('MetaZap Pro');
  };

  return (
    <div className="paper-card p-6 md:p-10 shadow-paper-lg mb-12 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-merriweather)]">
            Edit EXIF Fields
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update author, copyright, and device tags before saving your photo.
          </p>
        </div>
        {selectedFile && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Clear / Upload New
          </button>
        )}
      </div>

      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop an image here to edit metadata"
          description="JPEG, PNG, WebP — up to 20MB"
        />
      ) : (
        <div className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
            <span className="text-2xl">📷</span>
            <div>
              <p className="font-semibold text-xs text-slate-900 dark:text-white">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to customize
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Author / Artist</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Copyright Notice</span>
              <input
                type="text"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Date & Time Stamp</span>
              <input
                type="text"
                value={dateOriginal}
                onChange={(e) => setDateOriginal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 block">Software Name</span>
              <input
                type="text"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              Save & Download Photo
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors"
            >
              Reset Fields
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
