'use client';

/**
 * EditorTool.tsx
 * Client component for the EXIF Editor page.
 * Uses UploadDropzone for selecting an image and injectExifData to generate a clean,
 * updated image Blob with customized EXIF metadata.
 */

import { useState } from 'react';
import { saveAs } from 'file-saver';
import UploadDropzone from '@/app/components/UploadDropzone';
import { injectExifData, formatExifDate } from '@/app/lib/exifEditor';

export default function EditorTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [author, setAuthor] = useState('Photographer');
  const [copyright, setCopyright] = useState('© 2026 All Rights Reserved');
  const [dateOriginal, setDateOriginal] = useState(formatExifDate());
  const [software, setSoftware] = useState('MetaZap Pro');
  const [isSaving, setIsSaving] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    if (!file || file.size === 0) return;
    setSelectedFile(file);
  };

  const handleApply = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      const result = await injectExifData(selectedFile, {
        author,
        copyright,
        dateOriginal,
        software,
        latitude: '',
        longitude: '',
      });
      // Serve the newly generated clean/edited Blob
      saveAs(result.blob, result.fileName);
    } catch (err) {
      console.error('Failed to update EXIF data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAuthor('Photographer');
    setCopyright('© 2026 All Rights Reserved');
    setDateOriginal(formatExifDate());
    setSoftware('MetaZap Pro');
    setIsSaving(false);
  };

  return (
    <div className="editorial-card p-6 md:p-10 mb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <div className="editorial-kicker mb-2">METADATA LAB // TAG INJECTOR</div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink dark:text-chalk">
            Custom EXIF Injector
          </h2>
          <p className="text-sm text-ink/70 dark:text-chalk/70 mt-1 font-sans">
            Customize author attribution, copyright declarations, and device tags before saving.
          </p>
        </div>
        {selectedFile && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto text-xs font-mono font-medium text-ink/80 dark:text-chalk/80 border border-hairline hover:bg-hairline/30 px-3 py-1.5 rounded-md transition-colors"
          >
            RESET / UPLOAD NEW
          </button>
        )}
      </div>

      {!selectedFile ? (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          label="Drop an image here to edit metadata"
          description="JPEG, PNG, WebP — up to 20MB"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />
      ) : (
        <div className="space-y-6">
          <div className="border border-hairline rounded-lg p-4 bg-surface-subtle flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-surface border border-hairline flex items-center justify-center font-mono text-xs font-bold text-ink dark:text-chalk shrink-0">
              EXIF
            </div>
            <div>
              <p className="font-mono font-semibold text-xs text-ink dark:text-chalk">{selectedFile.name}</p>
              <p className="font-mono text-[11px] text-ink/60 dark:text-chalk/60">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · READY FOR INJECTION
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-mono text-ink/70 dark:text-chalk/70 uppercase mb-1.5 block">Author / Artist</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-ink/70 dark:text-chalk/70 uppercase mb-1.5 block">Copyright Notice</span>
              <input
                type="text"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-ink/70 dark:text-chalk/70 uppercase mb-1.5 block">Date &amp; Time Stamp</span>
              <input
                type="text"
                value={dateOriginal}
                onChange={(e) => setDateOriginal(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono text-ink/70 dark:text-chalk/70 uppercase mb-1.5 block">Software Stamp</span>
              <input
                type="text"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-hairline bg-surface text-xs font-mono text-ink dark:text-chalk focus:outline-hidden focus:border-ink dark:focus:border-chalk transition-all"
              />
            </label>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleApply}
              disabled={isSaving}
              className="px-6 py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 disabled:opacity-50 text-xs font-mono font-bold tracking-wider uppercase rounded-md shadow-sm transition-all"
            >
              {isSaving ? 'INJECTING...' : 'SAVE & DOWNLOAD PHOTO'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 border border-hairline bg-surface hover:bg-hairline/30 text-ink/80 dark:text-chalk/80 text-xs font-mono font-medium rounded-md transition-colors"
            >
              RESET FIELDS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
