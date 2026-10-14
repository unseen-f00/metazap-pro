/**
 * imageAnalyzer.ts — Client-Side Metadata & AI Analysis Engine
 *
 * Uses robust client-side libraries:
 * 1. exifr: comprehensive extraction of EXIF, GPS, TIFF, XMP, IPTC, and ICC tags
 * 2. piexifjs: binary JPEG segment analysis and parsing
 *
 * Provides:
 * - analyzeDeepMetadata: Windows File Properties categorized extraction + GPS coordinates
 * - calculateMetadataStructure: Computes file size vs cleaned blob size, difference, tags found/removed
 * - analyzePhotoPrivacy: Evaluates 0-100 Privacy Risk Score based on real extracted tags
 * - checkC2paCredentials: Scans for C2PA manifests and JUMBF boxes
 * - scanAiSignatures: Detects AI generation tags (Midjourney, DALL-E, Stable Diffusion)
 *
 * 100% Client-Side — Zero Server Communication.
 */

import exifr from 'exifr';
import piexif from 'piexifjs';

export interface TagItem {
  label: string;
  value: string;
  isSensitive?: boolean;
}

export interface MetadataSection {
  category: string;
  tags: TagItem[];
}

export interface WindowsPropertyDetails {
  cameraMake?: string;
  cameraModel?: string;
  cameraCombined?: string;
  fStop?: string;
  iso?: string;
  exposureTime?: string;
  lensInfo?: string;
  software?: string;
  dateTaken?: string;
  author?: string;
  copyright?: string;
  focalLength?: string;
  dimensions?: string;
  resolution?: string;
  colorSpace?: string;
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    formatted: string;
  };
}

export interface DeepMetadataResult {
  hasMetadata: boolean;
  sections: MetadataSection[];
  summary: {
    camera?: string;
    date?: string;
    location?: string;
    software?: string;
    format: string;
    totalTags: number;
  };
  details: WindowsPropertyDetails;
  rawTags: Record<string, string>;
}

export interface MetadataCalculationResult {
  fileSizeBytes: number;
  fileSizeFormatted: string;
  cleanedSizeBytes: number;
  cleanedSizeFormatted: string;
  metadataSizeBytes: number;
  metadataSizeFormatted: string;
  metadataPercentage: number;
  totalTagsFound: number;
  tagsRemovedCount: number;
  spaceSavedBytes: number;
  spaceSavedFormatted: string;
  dimensions: {
    width: number;
    height: number;
  };
  megapixels: string;
  mimeType: string;
  formatName: string;
  dpi: number;
}

export interface PrivacyFinding {
  level: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  tagValue?: string;
}

export interface PrivacyAnalysisResult {
  score: number; // 0 (Safe) to 100 (High Risk)
  riskLevel: 'high' | 'medium' | 'safe';
  findings: PrivacyFinding[];
  summaryMessage: string;
}

export interface C2paCheckResult {
  hasC2pa: boolean;
  status: 'detected' | 'clean';
  manifestType?: string;
  details: string[];
}

export interface AiSignatureIndicator {
  source: string;
  label: string;
  snippet: string;
  confidence?: 'high' | 'medium' | 'low';
}

export interface AiScanResult {
  isAiDetected: boolean;
  probability: number;
  engineName?: string;
  indicators: AiSignatureIndicator[];
  detectionMode?: string;
  inspectionNote?: string;
}

export interface ExactMetadataMeasurement {
  metadataBytes: number;
  detectedSegments: { name: string; bytes: number }[];
}

/** Helper: Format byte counts into human-readable strings */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/** Helper: Get image natural pixel dimensions */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth || 0, height: img.naturalHeight || 0 });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

/** Helper: Format Exposure Time nicely (e.g. 0.0083333 -> "1/120s") */
function formatExposureTime(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') {
    if (val === 0) return '0s';
    if (val < 1) {
      const denominator = Math.round(1 / val);
      return `1/${denominator}s`;
    }
    return `${val}s`;
  }
  return String(val);
}

/** Helper: Format F-Stop (e.g. 1.8 -> "f/1.8") */
function formatFStop(val: unknown): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'string') {
    return val.startsWith('f/') ? val : `f/${val}`;
  }
  if (typeof val === 'number') {
    return `f/${val % 1 === 0 ? val : val.toFixed(1)}`;
  }
  return String(val);
}

/** Helper: Format Date/Time cleanly */
function formatDate(val: unknown): string | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return val.toISOString().replace('T', ' ').substring(0, 19);
  }
  return String(val);
}

// =========================================================================
// 1. DEEP METADATA VIEWER (/tell-me-my-metadata)
// =========================================================================
export async function analyzeDeepMetadata(file: File): Promise<DeepMetadataResult> {
  const sections: MetadataSection[] = [];
  const rawTagsMap: Record<string, string> = {};

  // Extract all tags via exifr
  let rawParsed: Record<string, unknown> = {};
  try {
    const parsed = await exifr.parse(file, {
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      gps: true,
      interop: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
      sanitize: false,
      mergeOutput: true,
    });
    if (parsed && typeof parsed === 'object') {
      rawParsed = parsed as Record<string, unknown>;
    }
  } catch {
    // File has no parseable headers or unsupported container
  }

  // Extract specific GPS coordinates via exifr.gps()
  let gpsCoords: { latitude: number; longitude: number; altitude?: number } | null = null;
  try {
    const gps = await exifr.gps(file);
    if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
      gpsCoords = {
        latitude: gps.latitude,
        longitude: gps.longitude,
        altitude: typeof (gps as { altitude?: number }).altitude === 'number' ? (gps as { altitude?: number }).altitude : undefined,
      };
    }
  } catch {
    // GPS not available
  }

  // Populate rawTagsMap
  for (const [key, value] of Object.entries(rawParsed)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !(value instanceof Date)) {
        try {
          rawTagsMap[key] = JSON.stringify(value);
        } catch {
          rawTagsMap[key] = '[Complex Object]';
        }
      } else {
        rawTagsMap[key] = String(value);
      }
    }
  }

  // Extract key Windows File Properties fields
  const cameraMake = rawParsed.Make ? String(rawParsed.Make).trim() : undefined;
  const cameraModel = rawParsed.Model ? String(rawParsed.Model).trim() : undefined;
  const cameraCombined =
    cameraMake && cameraModel
      ? cameraModel.toLowerCase().includes(cameraMake.toLowerCase())
        ? cameraModel
        : `${cameraMake} ${cameraModel}`
      : cameraModel || cameraMake || undefined;

  const fStop = formatFStop(rawParsed.FNumber ?? rawParsed.ApertureValue);
  const iso = rawParsed.ISO ? String(rawParsed.ISO) : rawParsed.ISOSpeedRatings ? String(rawParsed.ISOSpeedRatings) : undefined;
  const exposureTime = formatExposureTime(rawParsed.ExposureTime ?? rawParsed.ShutterSpeedValue);
  
  const lensInfo = rawParsed.LensModel
    ? String(rawParsed.LensModel)
    : rawParsed.LensInfo
    ? String(rawParsed.LensInfo)
    : rawParsed.LensMake
    ? String(rawParsed.LensMake)
    : undefined;

  const software = rawParsed.Software ? String(rawParsed.Software) : undefined;
  const dateTaken = formatDate(rawParsed.DateTimeOriginal ?? rawParsed.CreateDate ?? rawParsed.ModifyDate);
  const author = rawParsed.Artist
    ? String(rawParsed.Artist)
    : rawParsed.XPAuthor
    ? String(rawParsed.XPAuthor)
    : rawParsed.Creator
    ? String(rawParsed.Creator)
    : rawParsed.byline
    ? String(rawParsed.byline)
    : undefined;

  const copyright = rawParsed.Copyright ? String(rawParsed.Copyright) : undefined;
  const focalLength = rawParsed.FocalLength ? `${rawParsed.FocalLength} mm` : undefined;

  const width = rawParsed.ImageWidth || rawParsed.ExifImageWidth;
  const height = rawParsed.ImageHeight || rawParsed.ExifImageHeight;
  const dimensionsStr = width && height ? `${width} × ${height} px` : undefined;

  const xRes = rawParsed.XResolution;
  const yRes = rawParsed.YResolution;
  const resolutionStr = xRes && yRes ? `${xRes} × ${yRes} DPI` : xRes ? `${xRes} DPI` : undefined;
  const colorSpace = rawParsed.ColorSpace ? String(rawParsed.ColorSpace) : undefined;

  // Build categorized sections (Windows File Properties style)
  // Section 1: Device & Camera Hardware
  const deviceTags: TagItem[] = [];
  if (cameraMake) deviceTags.push({ label: 'Camera Manufacturer', value: cameraMake });
  if (cameraModel) deviceTags.push({ label: 'Camera Model', value: cameraModel });
  if (lensInfo) deviceTags.push({ label: 'Lens Specification', value: lensInfo });
  if (software) deviceTags.push({ label: 'Software / Firmware', value: software });
  if (rawParsed.SerialNumber || rawParsed.BodySerialNumber) {
    deviceTags.push({
      label: 'Camera Serial Number',
      value: String(rawParsed.SerialNumber || rawParsed.BodySerialNumber),
      isSensitive: true,
    });
  }
  if (rawParsed.LensSerialNumber) {
    deviceTags.push({
      label: 'Lens Serial Number',
      value: String(rawParsed.LensSerialNumber),
      isSensitive: true,
    });
  }
  if (deviceTags.length > 0) {
    sections.push({ category: 'Device & Camera Hardware', tags: deviceTags });
  }

  // Section 2: Exposure & Optical Settings
  const photoTags: TagItem[] = [];
  if (fStop) photoTags.push({ label: 'Aperture (F-Stop)', value: fStop });
  if (exposureTime) photoTags.push({ label: 'Exposure Time (Shutter)', value: exposureTime });
  if (iso) photoTags.push({ label: 'ISO Sensitivity', value: iso });
  if (focalLength) photoTags.push({ label: 'Focal Length', value: focalLength });
  if (rawParsed.FocalLengthIn35mmFormat) {
    photoTags.push({ label: '35mm Equivalent Focal Length', value: `${rawParsed.FocalLengthIn35mmFormat} mm` });
  }
  if (rawParsed.Flash) photoTags.push({ label: 'Flash State', value: String(rawParsed.Flash) });
  if (rawParsed.MeteringMode) photoTags.push({ label: 'Metering Mode', value: String(rawParsed.MeteringMode) });
  if (rawParsed.ExposureProgram) photoTags.push({ label: 'Exposure Program', value: String(rawParsed.ExposureProgram) });
  if (rawParsed.WhiteBalance) photoTags.push({ label: 'White Balance', value: String(rawParsed.WhiteBalance) });
  if (photoTags.length > 0) {
    sections.push({ category: 'Exposure & Optical Settings', tags: photoTags });
  }

  // Section 3: GPS & Geolocation Coordinates
  const gpsTags: TagItem[] = [];
  let locationSummary: string | undefined;
  if (gpsCoords) {
    const latStr = `${gpsCoords.latitude.toFixed(6)}°`;
    const lonStr = `${gpsCoords.longitude.toFixed(6)}°`;
    gpsTags.push({ label: 'Latitude', value: latStr, isSensitive: true });
    gpsTags.push({ label: 'Longitude', value: lonStr, isSensitive: true });
    if (gpsCoords.altitude !== undefined) {
      gpsTags.push({ label: 'Altitude', value: `${gpsCoords.altitude.toFixed(1)} m above sea level`, isSensitive: true });
    }
    locationSummary = `${latStr}, ${lonStr}`;
  }
  if (gpsTags.length > 0) {
    sections.push({ category: 'Location & Geolocation (GPS)', tags: gpsTags });
  }

  // Section 4: Image & File Properties
  const fileTags: TagItem[] = [];
  if (dimensionsStr) fileTags.push({ label: 'Pixel Dimensions', value: dimensionsStr });
  if (resolutionStr) fileTags.push({ label: 'Resolution Density', value: resolutionStr });
  if (colorSpace) fileTags.push({ label: 'Color Space Profile', value: colorSpace });
  if (rawParsed.Orientation) fileTags.push({ label: 'Orientation', value: String(rawParsed.Orientation) });
  if (rawParsed.BitsPerSample) fileTags.push({ label: 'Bit Depth', value: `${rawParsed.BitsPerSample} bits` });
  if (fileTags.length > 0) {
    sections.push({ category: 'Image & File Properties', tags: fileTags });
  }

  // Section 5: Origin & Authorship
  const originTags: TagItem[] = [];
  if (author) originTags.push({ label: 'Author / Artist', value: author, isSensitive: true });
  if (copyright) originTags.push({ label: 'Copyright Notice', value: copyright });
  if (dateTaken) originTags.push({ label: 'Date/Time Taken', value: dateTaken, isSensitive: true });
  if (rawParsed.CreateDate && String(rawParsed.CreateDate) !== dateTaken) {
    originTags.push({ label: 'Date/Time Digitized', value: formatDate(rawParsed.CreateDate) || '' });
  }
  if (originTags.length > 0) {
    sections.push({ category: 'Origin & Copyright', tags: originTags });
  }

  // Check piexif fallback for older JPEGs if exifr was sparse
  if (sections.length === 0 && file.type === 'image/jpeg') {
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const exifObj = piexif.load(base64);
      if (exifObj && exifObj['0th']) {
        const fallbackTags: TagItem[] = [];
        const make = exifObj['0th'][piexif.ImageIFD.Make];
        const model = exifObj['0th'][piexif.ImageIFD.Model];
        if (make) fallbackTags.push({ label: 'Make', value: String(make) });
        if (model) fallbackTags.push({ label: 'Model', value: String(model) });
        if (fallbackTags.length > 0) {
          sections.push({ category: 'Basic EXIF (Legacy)', tags: fallbackTags });
        }
      }
    } catch {
      // Ignored
    }
  }

  const totalTags = Object.keys(rawTagsMap).length;
  const hasMetadata = totalTags > 0 || sections.length > 0;

  const details: WindowsPropertyDetails = {
    cameraMake,
    cameraModel,
    cameraCombined,
    fStop,
    iso,
    exposureTime,
    lensInfo,
    software,
    dateTaken,
    author,
    copyright,
    focalLength,
    dimensions: dimensionsStr,
    resolution: resolutionStr,
    colorSpace,
    gps: gpsCoords
      ? {
          latitude: gpsCoords.latitude,
          longitude: gpsCoords.longitude,
          altitude: gpsCoords.altitude,
          formatted: `${gpsCoords.latitude.toFixed(6)}°, ${gpsCoords.longitude.toFixed(6)}°`,
        }
      : undefined,
  };

  return {
    hasMetadata,
    sections,
    summary: {
      camera: cameraCombined,
      date: dateTaken,
      location: locationSummary,
      software,
      format: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
      totalTags,
    },
    details,
    rawTags: rawTagsMap,
  };
}

// =========================================================================
// 2. DATA CALCULATOR & ANALYTICS (/calculate-metadata)
// =========================================================================

/** Helper: Measure exact JPEG metadata marker segments (APP0-APP15, COM) */
function measureJpegMetadataBytes(bytes: Uint8Array): ExactMetadataMeasurement {
  const detectedSegments: { name: string; bytes: number }[] = [];
  let metadataBytes = 0;

  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return { metadataBytes: 0, detectedSegments };
  }

  let offset = 2;
  while (offset < bytes.length - 1) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = bytes[offset + 1];

    // Skip fill bytes
    if (marker === 0xff || marker === 0x00) {
      offset++;
      continue;
    }

    // SOS (Start of Scan 0xDA) or EOI (0xD9) - pixel entropy scan begins
    if (marker === 0xda || marker === 0xd9) {
      break;
    }

    // Standalone markers without length: RST0-RST7 (0xD0-0xD7), SOI (0xD8), TEM (0x01)
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }

    if (offset + 3 >= bytes.length) break;
    const segmentPayloadLen = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const fullSegmentSize = 2 + segmentPayloadLen; // 2 marker bytes + payload length

    // APP0 to APP15 (0xE0 - 0xEF) or COM (0xFE)
    const isAppMarker = marker >= 0xe0 && marker <= 0xef;
    const isComment = marker === 0xfe;

    if (isAppMarker || isComment) {
      let segmentName = isComment ? 'COM (Comment)' : `APP${marker - 0xe0}`;
      if (marker === 0xe1 && offset + 8 < bytes.length) {
        const id = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
        if (id.startsWith('Exif')) segmentName = 'APP1 (EXIF / GPS / TIFF)';
        else if (id.startsWith('http')) segmentName = 'APP1 (Adobe XMP)';
      } else if (marker === 0xe2 && offset + 8 < bytes.length) {
        const id = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
        if (id.startsWith('ICC_')) segmentName = 'APP2 (ICC Color Profile)';
      } else if (marker === 0xed) {
        segmentName = 'APP13 (Photoshop IPTC)';
      }

      detectedSegments.push({ name: segmentName, bytes: fullSegmentSize });
      metadataBytes += fullSegmentSize;
    }

    offset += fullSegmentSize;
  }

  return { metadataBytes, detectedSegments };
}

/** Helper: Measure exact PNG ancillary metadata chunks (tEXt, zTXt, iTXt, eXIf, iCCP, pHYs, etc.) */
function measurePngMetadataBytes(bytes: Uint8Array): ExactMetadataMeasurement {
  const detectedSegments: { name: string; bytes: number }[] = [];
  let metadataBytes = 0;

  const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 8) return { metadataBytes: 0, detectedSegments };
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== pngSig[i]) return { metadataBytes: 0, detectedSegments };
  }

  let offset = 8;
  const criticalChunks = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND']);

  while (offset + 8 <= bytes.length) {
    const chunkDataLength =
      ((bytes[offset] << 24) >>> 0) +
      (bytes[offset + 1] << 16) +
      (bytes[offset + 2] << 8) +
      bytes[offset + 3];

    const typeStr = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    );

    const totalChunkBytes = 12 + chunkDataLength; // 4 len + 4 type + data + 4 crc

    if (!criticalChunks.has(typeStr)) {
      let desc = typeStr;
      if (typeStr === 'tEXt' || typeStr === 'iTXt' || typeStr === 'zTXt') {
        desc = `${typeStr} (Text / AI Prompts)`;
      } else if (typeStr === 'eXIf') {
        desc = 'eXIf (EXIF Metadata)';
      } else if (typeStr === 'iCCP') {
        desc = 'iCCP (ICC Color Profile)';
      } else if (typeStr === 'pHYs') {
        desc = 'pHYs (Physical Dimensions)';
      } else if (typeStr === 'tIME') {
        desc = 'tIME (Timestamp)';
      }

      detectedSegments.push({ name: desc, bytes: totalChunkBytes });
      metadataBytes += totalChunkBytes;
    }

    offset += totalChunkBytes;
    if (typeStr === 'IEND') break;
  }

  return { metadataBytes, detectedSegments };
}

/** Helper: Measure exact WebP metadata chunks (EXIF, XMP, ICCP) */
function measureWebpMetadataBytes(bytes: Uint8Array): ExactMetadataMeasurement {
  const detectedSegments: { name: string; bytes: number }[] = [];
  let metadataBytes = 0;

  if (bytes.length < 12) return { metadataBytes: 0, detectedSegments };
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff !== 'RIFF' || webp !== 'WEBP') return { metadataBytes: 0, detectedSegments };

  let offset = 12;
  const metadataFourCCs: Record<string, string> = {
    'EXIF': 'EXIF (Camera / GPS Data)',
    'XMP ': 'XMP (Adobe Extensible Metadata)',
    'ICCP': 'ICCP (Color Profile)',
  };

  while (offset + 8 <= bytes.length) {
    const fourCC = String.fromCharCode(...bytes.slice(offset, offset + 4));
    const chunkLen =
      bytes[offset + 4] |
      (bytes[offset + 5] << 8) |
      (bytes[offset + 6] << 16) |
      (bytes[offset + 7] << 24);

    const paddedLen = chunkLen + (chunkLen % 2); // RIFF chunks are 2-byte aligned
    const totalChunkBytes = 8 + paddedLen;

    if (metadataFourCCs[fourCC]) {
      detectedSegments.push({ name: metadataFourCCs[fourCC], bytes: totalChunkBytes });
      metadataBytes += totalChunkBytes;
    }

    offset += totalChunkBytes;
  }

  return { metadataBytes, detectedSegments };
}

/**
 * Measure exact metadata segment byte lengths directly from binary container headers.
 * 100% Client-Side, bit-accurate, zero canvas re-rendering.
 */
export async function measureExactMetadataBytes(file: File): Promise<ExactMetadataMeasurement> {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. JPEG
    if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) {
      return measureJpegMetadataBytes(bytes);
    }

    // 2. PNG
    if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return measurePngMetadataBytes(bytes);
    }

    // 3. WebP (RIFF)
    if (
      bytes.length >= 12 &&
      bytes[0] === 0x52 && // 'R'
      bytes[1] === 0x49 && // 'I'
      bytes[2] === 0x46 && // 'F'
      bytes[3] === 0x46 // 'F'
    ) {
      return measureWebpMetadataBytes(bytes);
    }

    return { metadataBytes: 0, detectedSegments: [] };
  } catch {
    return { metadataBytes: 0, detectedSegments: [] };
  }
}

export async function calculateMetadataStructure(file: File): Promise<MetadataCalculationResult> {
  const fileSizeBytes = file.size;
  const fileSizeFormatted = formatBytes(fileSizeBytes);

  // Read actual dimensions
  const dims = await getImageDimensions(file);
  const megapixels =
    dims.width > 0 && dims.height > 0
      ? `${((dims.width * dims.height) / 1_000_000).toFixed(1)} MP`
      : 'Unknown';

  // Count true extracted tags via exifr
  let totalTagsFound = 0;
  try {
    const parsed = await exifr.parse(file, {
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      gps: true,
    });
    if (parsed && typeof parsed === 'object') {
      totalTagsFound = Object.keys(parsed).length;
    }
  } catch {
    totalTagsFound = 0;
  }

  // Calculate exact metadata bytes directly from binary container headers (Zero Canvas re-rendering)
  const exactMeta = await measureExactMetadataBytes(file);
  let metadataSizeBytes = exactMeta.metadataBytes;

  // Fallback estimation for container formats lacking standard APP/chunk blocks if tags were detected
  if (metadataSizeBytes === 0 && totalTagsFound > 0) {
    metadataSizeBytes = Math.min(Math.round(fileSizeBytes * 0.05), Math.max(totalTagsFound * 96, 512));
  }

  // Clamp metadata size to file size
  if (metadataSizeBytes > fileSizeBytes) {
    metadataSizeBytes = fileSizeBytes;
  }

  const spaceSavedBytes = metadataSizeBytes;
  const cleanedSizeBytes = Math.max(1, fileSizeBytes - spaceSavedBytes);

  const cleanedSizeFormatted = formatBytes(cleanedSizeBytes);
  const metadataSizeFormatted = formatBytes(metadataSizeBytes);
  const spaceSavedFormatted = formatBytes(spaceSavedBytes);

  const metadataPercentage =
    fileSizeBytes > 0 ? parseFloat(((spaceSavedBytes / fileSizeBytes) * 100).toFixed(1)) : 0;

  return {
    fileSizeBytes,
    fileSizeFormatted,
    cleanedSizeBytes,
    cleanedSizeFormatted,
    metadataSizeBytes,
    metadataSizeFormatted,
    metadataPercentage,
    totalTagsFound,
    tagsRemovedCount: totalTagsFound,
    spaceSavedBytes,
    spaceSavedFormatted,
    dimensions: dims,
    megapixels,
    mimeType: file.type || 'image/jpeg',
    formatName: (file.type.split('/')[1] || 'JPEG').toUpperCase(),
    dpi: 72,
  };
}

// =========================================================================
// 3. PRIVACY ANALYZER (/photo-privacy-analyzer)
// =========================================================================
export async function analyzePhotoPrivacy(file: File): Promise<PrivacyAnalysisResult> {
  const findings: PrivacyFinding[] = [];
  let score = 0;

  // 1. Check GPS Geolocation (Critical Risk)
  try {
    const gps = await exifr.gps(file);
    if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
      score += 45;
      findings.push({
        level: 'high',
        title: 'Precise GPS Location Coordinates Embedded',
        description:
          'Your exact geographic coordinates (home, office, or private location) are stamped into this photo.',
        tagValue: `${gps.latitude.toFixed(6)}°, ${gps.longitude.toFixed(6)}°`,
      });
    }
  } catch {
    // No GPS
  }

  // 2. Parse EXIF & XMP
  try {
    const parsed = (await exifr.parse(file, {
      tiff: true,
      xmp: true,
      gps: true,
    })) as Record<string, unknown> | undefined;

    if (parsed) {
      // Hardware Serial Number
      if (parsed.SerialNumber || parsed.BodySerialNumber || parsed.LensSerialNumber) {
        score += 20;
        findings.push({
          level: 'high',
          title: 'Unique Camera/Lens Hardware Serial Number',
          description:
            'A permanent physical serial number is embedded, allowing investigators to track all photos taken with your equipment.',
          tagValue: `Serial: ${String(parsed.SerialNumber || parsed.BodySerialNumber || parsed.LensSerialNumber)}`,
        });
      }

      // Author / Creator
      const author = parsed.Artist || parsed.XPAuthor || parsed.Creator || parsed.byline;
      if (author) {
        score += 15;
        findings.push({
          level: 'medium',
          title: 'Personal Creator / Author Identity',
          description: 'Your real name or photographer tag is written directly in the file metadata.',
          tagValue: `Author: ${String(author)}`,
        });
      }

      // Date Taken
      if (parsed.DateTimeOriginal || parsed.CreateDate) {
        score += 10;
        findings.push({
          level: 'low',
          title: 'Exact Capture Timestamp',
          description: 'The exact year, minute, and second you took this photo is recorded.',
          tagValue: `Timestamp: ${formatDate(parsed.DateTimeOriginal || parsed.CreateDate)}`,
        });
      }

      // Software / Device Info
      if (parsed.Software || parsed.Model) {
        score += 10;
        findings.push({
          level: 'low',
          title: 'Hardware Model & Processing Software',
          description: 'Reveals the exact camera or smartphone model and operating system version.',
          tagValue: `${String(parsed.Model || '')} ${parsed.Software ? `· ${String(parsed.Software)}` : ''}`.trim(),
        });
      }
    }
  } catch {
    // No parseable EXIF
  }

  // Clamp score
  score = Math.min(100, Math.max(0, score));

  let riskLevel: 'high' | 'medium' | 'safe' = 'safe';
  let summaryMessage = 'Photo is Safe: Minimal or no private tracking metadata detected.';

  if (score >= 45) {
    riskLevel = 'high';
    summaryMessage = 'High Privacy Threat: Sensitive location or hardware tracking tags found!';
  } else if (score >= 20) {
    riskLevel = 'medium';
    summaryMessage = 'Medium Risk: Author identity or capture timeline tags detected.';
  }

  return {
    score,
    riskLevel,
    findings,
    summaryMessage,
  };
}

// =========================================================================
// 4. C2PA & CONTENT CREDENTIALS SCANNER
// =========================================================================
export async function checkC2paCredentials(file: File): Promise<C2paCheckResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const details: string[] = [];

  // Look for JUMBF signature ("jumb" in ASCII: 0x6A, 0x75, 0x6D, 0x62)
  let foundJumbf = false;
  for (let i = 0; i < bytes.length - 8; i++) {
    if (
      bytes[i] === 0x6a &&
      bytes[i + 1] === 0x75 &&
      bytes[i + 2] === 0x6d &&
      bytes[i + 3] === 0x62
    ) {
      foundJumbf = true;
      details.push(`Found JUMBF Box at byte offset ${i.toLocaleString()}`);
      break;
    }
  }

  // Look for C2PA XMP references
  const decoder = new TextDecoder('latin1');
  const textSample = decoder.decode(bytes.slice(0, Math.min(bytes.length, 131072)));
  if (textSample.includes('c2pa') || textSample.includes('contentauth')) {
    details.push('Detected C2PA / Content Credentials manifest XML packet');
    foundJumbf = true;
  }

  return {
    hasC2pa: foundJumbf,
    status: foundJumbf ? 'detected' : 'clean',
    manifestType: foundJumbf ? 'C2PA JUMBF Manifest' : undefined,
    details: details.length > 0 ? details : ['No C2PA or cryptographic provenance blocks found.'],
  };
}

// =========================================================================
// 5. AI SIGNATURE SCANNER
// =========================================================================
export async function scanAiSignatures(file: File): Promise<AiScanResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Scan up to 256KB to inspect headers and metadata chunks
  const scanLength = Math.min(bytes.length, 262144);
  const sampleSlice = bytes.slice(0, scanLength);

  // Decode with both latin1 (preserves byte indices) and utf-8 (preserves JSON / unicode characters)
  const latin1Text = new TextDecoder('latin1').decode(sampleSlice);
  let utf8Text = '';
  try {
    utf8Text = new TextDecoder('utf-8', { fatal: false }).decode(sampleSlice);
  } catch {
    utf8Text = latin1Text;
  }

  const textSample = latin1Text + '\n' + utf8Text;
  const indicators: AiSignatureIndicator[] = [];
  const detectedEngines = new Set<string>();
  let strongSignals = 0;
  let mediumSignals = 0;

  // 1. Stable Diffusion / Automatic1111 / WebUI
  const hasSdParams =
    textSample.includes('Steps:') &&
    (textSample.includes('CFG scale:') || textSample.includes('Sampler:') || textSample.includes('Seed:'));
  const hasSdPrompt =
    textSample.includes('parameters') &&
    (textSample.includes('Negative prompt:') || textSample.includes('Model:') || textSample.includes('Clip skip'));

  if (hasSdParams || hasSdPrompt) {
    strongSignals += 2;
    detectedEngines.add('Stable Diffusion / Automatic1111');

    let snippet = 'Found diffusion generation parameters (Steps, Sampler, CFG Scale, Seed) in container text header.';
    const stepIdx = textSample.indexOf('Steps:');
    if (stepIdx !== -1) {
      const excerpt = textSample.slice(Math.max(0, stepIdx - 20), Math.min(textSample.length, stepIdx + 120)).trim();
      if (excerpt) snippet = excerpt.replace(/[\x00-\x1F\x7F]/g, ' ');
    }

    indicators.push({
      source: 'Stable Diffusion',
      label: 'Diffusion Generation Parameters',
      snippet,
      confidence: 'high',
    });
  }

  // 2. ComfyUI Workflow Graphs
  const hasComfyNodes =
    (textSample.includes('KSampler') || textSample.includes('CheckpointLoaderSimple')) &&
    (textSample.includes('extra_pnginfo') || textSample.includes('"class_type"') || textSample.includes('"workflow"'));

  if (hasComfyNodes) {
    strongSignals += 2;
    detectedEngines.add('ComfyUI Node Workflow');
    indicators.push({
      source: 'ComfyUI',
      label: 'ComfyUI Node Graph Execution Metadata',
      snippet: 'Found full node execution graph (KSampler, VAE, Checkpoint) in PNG iTXt chunk.',
      confidence: 'high',
    });
  }

  // 3. Midjourney
  const hasMjVersion =
    textSample.includes('--v 4') ||
    textSample.includes('--v 5') ||
    textSample.includes('--v 6') ||
    textSample.includes('--niji');
  const hasMjParams = textSample.includes('--ar ') || textSample.includes('--stylize ') || textSample.includes('--chaos ');
  const hasMjName = textSample.includes('Midjourney') || textSample.includes('/imagine');

  if (hasMjVersion || (hasMjParams && hasMjName)) {
    strongSignals += 2;
    detectedEngines.add('Midjourney');

    let snippet = 'Found Midjourney generation parameters (--v, --ar, --stylize) inside metadata chunk.';
    const vIdx = textSample.search(/--v\s+[456]/);
    if (vIdx !== -1) {
      const excerpt = textSample.slice(Math.max(0, vIdx - 30), Math.min(textSample.length, vIdx + 80)).trim();
      if (excerpt) snippet = excerpt.replace(/[\x00-\x1F\x7F]/g, ' ');
    }

    indicators.push({
      source: 'Midjourney',
      label: 'Midjourney Prompt & Version Flag',
      snippet,
      confidence: 'high',
    });
  } else if (hasMjName) {
    mediumSignals += 1;
    detectedEngines.add('Midjourney');
    indicators.push({
      source: 'Midjourney',
      label: 'Midjourney Generator Tag',
      snippet: 'Found Midjourney keyword marker in file header.',
      confidence: 'medium',
    });
  }

  // 4. OpenAI DALL-E
  const hasDalleName = textSample.toLowerCase().includes('dall-e') || textSample.includes('DALL·E');
  const hasOpenAiTag = textSample.includes('OpenAI') || textSample.includes('generation_id');

  if (hasDalleName && hasOpenAiTag) {
    strongSignals += 2;
    detectedEngines.add('OpenAI DALL-E');
    indicators.push({
      source: 'OpenAI',
      label: 'DALL-E Generative Metadata Tag',
      snippet: 'Found OpenAI DALL-E generation ID and synthetic provenance header.',
      confidence: 'high',
    });
  } else if (hasDalleName || hasOpenAiTag) {
    mediumSignals += 1;
    detectedEngines.add('OpenAI DALL-E');
    indicators.push({
      source: 'OpenAI',
      label: 'OpenAI Generator Marker',
      snippet: 'Found OpenAI generative marker in image metadata.',
      confidence: 'medium',
    });
  }

  // 5. Civitai / Checkpoint Models
  if (textSample.includes('civitai:') || textSample.includes('Civitai Resources')) {
    mediumSignals += 1;
    indicators.push({
      source: 'Civitai',
      label: 'Civitai Model & LoRA Resource Link',
      snippet: 'Found Civitai model hashes and training resource identifiers embedded in metadata.',
      confidence: 'medium',
    });
  }

  // 6. Adobe Firefly / Content Credentials Synthetic Provenance
  if (
    textSample.includes('digitalSourceType/trainedAlgorithmicMedia') ||
    (textSample.includes('Firefly') && textSample.includes('Adobe'))
  ) {
    strongSignals += 1;
    detectedEngines.add('Adobe Firefly');
    indicators.push({
      source: 'Adobe Firefly',
      label: 'Trained Algorithmic Media Provenance',
      snippet: 'Found Adobe C2PA digitalSourceType flag declaring trained algorithmic media.',
      confidence: 'high',
    });
  }

  // 7. Fooocus
  if (textSample.includes('Fooocus') && textSample.includes('sharpness')) {
    strongSignals += 2;
    detectedEngines.add('Fooocus');
    indicators.push({
      source: 'Fooocus',
      label: 'Fooocus Inpainting / Diffusion Settings',
      snippet: 'Found Fooocus pipeline configuration in image text dictionary.',
      confidence: 'high',
    });
  }

  // Dynamic Probability Calculation based on verified signals
  let probability = 0;
  const isAiDetected = indicators.length > 0;

  if (isAiDetected) {
    if (strongSignals >= 4) {
      probability = 99;
    } else if (strongSignals >= 2) {
      probability = 95;
    } else if (strongSignals === 1 && mediumSignals >= 1) {
      probability = 90;
    } else if (strongSignals === 1) {
      probability = 85;
    } else if (mediumSignals >= 2) {
      probability = 80;
    } else {
      probability = 70;
    }
  }

  const engineName =
    detectedEngines.size > 0 ? Array.from(detectedEngines).join(' / ') : undefined;

  return {
    isAiDetected,
    probability,
    engineName,
    indicators,
    detectionMode: 'container_metadata_signatures',
    inspectionNote:
      'Container Metadata Inspection: Analysis is conducted by inspecting embedded metadata container segments (PNG iTXt/tEXt chunks, JPEG APP1 XMP/Exif, and workflow parameters). Forensic steganographic pixel frequency analysis is not performed.',
  };
}
