import { loadJSON, saveJSON } from './storage.js';
import { slugify } from './slug.js';

const FUNDAMENTALS_READ_KEY = 'pathforge:fundamentals:read';

function getLocalDateStr(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getFundamentalsReadMap() {
  return loadJSON(FUNDAMENTALS_READ_KEY, {});
}

export function getSectionReadDate(topicKey, sectionName) {
  const readMap = getFundamentalsReadMap();
  return readMap?.[topicKey]?.[slugify(sectionName)] ?? null;
}

export function isSectionFundamentalsRead(topicKey, sectionName) {
  return !!getSectionReadDate(topicKey, sectionName);
}

export function markSectionFundamentalsRead(topicKey, sectionName, dateRead = getLocalDateStr()) {
  const readMap = getFundamentalsReadMap();
  const sectionSlug = slugify(sectionName);
  const existing = readMap?.[topicKey]?.[sectionSlug];

  if (existing) return existing;

  saveJSON(FUNDAMENTALS_READ_KEY, {
    ...readMap,
    [topicKey]: {
      ...(readMap[topicKey] || {}),
      [sectionSlug]: dateRead,
    },
  });

  return dateRead;
}

export function getTopicFundamentalsReadCount(topicKey, sectionNames = []) {
  return sectionNames.filter((sectionName) => isSectionFundamentalsRead(topicKey, sectionName)).length;
}