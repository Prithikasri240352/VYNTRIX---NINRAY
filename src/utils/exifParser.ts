/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExifPhotoGpsDetail } from '../types/aicte';

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula. Returns distance in kilometers (with 3 decimal precision).
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 1000) / 1000;
}

/**
 * Safely extracts EXIF GPS metadata from an image file (JPEG/JPG/TIFF).
 * If valid EXIF GPS markers are detected, parses latitude, longitude, and camera model.
 * If no embedded tags are found, gracefully returns null.
 */
export async function extractExifGpsFromImage(
  file: File
): Promise<ExifPhotoGpsDetail | null> {
  // Only image files can have EXIF tags
  if (!file.type.startsWith('image/')) {
    return null;
  }

  try {
    const buffer = await file.arrayBuffer();
    const dataView = new DataView(buffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (dataView.getUint16(0) !== 0xffd8) {
      return null;
    }

    let offset = 2;
    const length = buffer.byteLength;

    while (offset < length - 2) {
      const marker = dataView.getUint16(offset);
      offset += 2;

      // APP1 marker (0xFFE1) contains EXIF
      if (marker === 0xffe1) {
        const app1Length = dataView.getUint16(offset);
        offset += 2;

        // Check for 'Exif\0\0' (0x457869660000)
        const exifHeader =
          String.fromCharCode(dataView.getUint8(offset)) +
          String.fromCharCode(dataView.getUint8(offset + 1)) +
          String.fromCharCode(dataView.getUint8(offset + 2)) +
          String.fromCharCode(dataView.getUint8(offset + 3));

        if (exifHeader === 'Exif') {
          const tiffStart = offset + 6;
          return parseTiffGps(dataView, tiffStart);
        }

        offset += app1Length - 2;
      } else if ((marker & 0xff00) === 0xff00) {
        // Skip other markers
        const markerLength = dataView.getUint16(offset);
        offset += markerLength;
      } else {
        break;
      }
    }

    return null;
  } catch (err) {
    console.warn('EXIF GPS extraction skipped or file format unsupported:', err);
    return null;
  }
}

function parseTiffGps(dataView: DataView, tiffStart: number): ExifPhotoGpsDetail | null {
  try {
    const byteOrder = dataView.getUint16(tiffStart);
    const littleEndian = byteOrder === 0x4949; // 'II'

    // Verify TIFF marker 42
    if (dataView.getUint16(tiffStart + 2, littleEndian) !== 42) {
      return null;
    }

    const firstIfdOffset = dataView.getUint32(tiffStart + 4, littleEndian);
    let ifdOffset = tiffStart + firstIfdOffset;

    let gpsIfdOffset = 0;
    let cameraModel: string | undefined = undefined;

    const numEntries = dataView.getUint16(ifdOffset, littleEndian);
    ifdOffset += 2;

    for (let i = 0; i < numEntries; i++) {
      const tag = dataView.getUint16(ifdOffset, littleEndian);
      const valueOffset = dataView.getUint32(ifdOffset + 8, littleEndian);

      // Model tag (0x0110)
      if (tag === 0x0110) {
        const strOffset = tiffStart + valueOffset;
        let str = '';
        for (let j = 0; j < 30; j++) {
          const charCode = dataView.getUint8(strOffset + j);
          if (charCode === 0) break;
          str += String.fromCharCode(charCode);
        }
        cameraModel = str.trim();
      }

      // GPS IFD Pointer tag (0x8825)
      if (tag === 0x8825) {
        gpsIfdOffset = tiffStart + valueOffset;
      }

      ifdOffset += 12;
    }

    if (!gpsIfdOffset) {
      return null;
    }

    // Parse GPS IFD entries
    let gpsOffset = gpsIfdOffset;
    const gpsNumEntries = dataView.getUint16(gpsOffset, littleEndian);
    gpsOffset += 2;

    let latRef = 'N';
    let lonRef = 'E';
    let latRaw: [number, number, number] | null = null;
    let lonRaw: [number, number, number] | null = null;

    for (let i = 0; i < gpsNumEntries; i++) {
      const tag = dataView.getUint16(gpsOffset, littleEndian);
      const valOffset = dataView.getUint32(gpsOffset + 8, littleEndian);

      if (tag === 0x0001) {
        // GPSLatitudeRef
        latRef = String.fromCharCode(dataView.getUint8(gpsOffset + 8));
      } else if (tag === 0x0002) {
        // GPSLatitude (3 rationals: deg, min, sec)
        latRaw = readThreeRationals(dataView, tiffStart + valOffset, littleEndian);
      } else if (tag === 0x0003) {
        // GPSLongitudeRef
        lonRef = String.fromCharCode(dataView.getUint8(gpsOffset + 8));
      } else if (tag === 0x0004) {
        // GPSLongitude (3 rationals: deg, min, sec)
        lonRaw = readThreeRationals(dataView, tiffStart + valOffset, littleEndian);
      }

      gpsOffset += 12;
    }

    if (latRaw && lonRaw) {
      const lat = convertDmsToDecimal(latRaw[0], latRaw[1], latRaw[2], latRef);
      const lon = convertDmsToDecimal(lonRaw[0], lonRaw[1], lonRaw[2], lonRef);

      return {
        latitude: Math.round(lat * 1000000) / 1000000,
        longitude: Math.round(lon * 1000000) / 1000000,
        cameraModel: cameraModel || 'Digital Camera / Mobile Sensor',
        timestampUtc: new Date().toISOString(),
        source: 'Embedded Image EXIF Tags'
      };
    }

    return null;
  } catch (err) {
    console.warn('Error reading TIFF GPS entries:', err);
    return null;
  }
}

function readThreeRationals(
  view: DataView,
  offset: number,
  littleEndian: boolean
): [number, number, number] {
  const dNum = view.getUint32(offset, littleEndian);
  const dDen = view.getUint32(offset + 4, littleEndian) || 1;

  const mNum = view.getUint32(offset + 8, littleEndian);
  const mDen = view.getUint32(offset + 12, littleEndian) || 1;

  const sNum = view.getUint32(offset + 16, littleEndian);
  const sDen = view.getUint32(offset + 20, littleEndian) || 1;

  return [dNum / dDen, mNum / mDen, sNum / sDen];
}

function convertDmsToDecimal(
  deg: number,
  min: number,
  sec: number,
  ref: string
): number {
  let decimal = deg + min / 60 + sec / 3600;
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return decimal;
}
