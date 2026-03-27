/**
 * Dummy wardrobe data for the Kasane frontend.
 *
 * Shape matches the backend contract:
 * { id, imageUrl, category, dominantColors: [{hex, japaneseNameJp, japaneseNameEn}] }
 *
 * imageUrl uses inline SVG data URIs as solid-color placeholders.
 */

function colorPlaceholder(hex) {
  const encoded = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280"><rect width="200" height="280" fill="${hex}"/></svg>`
  );
  return `data:image/svg+xml,${encoded}`;
}

const dummyWardrobe = [
  {
    id: 'item-1',
    imageUrl: colorPlaceholder('#ef4523'),
    category: 'Top',
    dominantColors: [
      { hex: '#ef4523', japaneseNameJp: '朱色', japaneseNameEn: 'Vermillion' },
    ],
  },
  {
    id: 'item-2',
    imageUrl: colorPlaceholder('#a8d8cb'),
    category: 'Outerwear',
    dominantColors: [
      { hex: '#a8d8cb', japaneseNameJp: '青磁色', japaneseNameEn: 'Celadon' },
    ],
  },
  {
    id: 'item-3',
    imageUrl: colorPlaceholder('#fef4f4'),
    category: 'Top',
    dominantColors: [
      { hex: '#fef4f4', japaneseNameJp: '桜色', japaneseNameEn: 'Cherry Blossom' },
    ],
  },
  {
    id: 'item-4',
    imageUrl: colorPlaceholder('#f8b500'),
    category: 'Top',
    dominantColors: [
      { hex: '#f8b500', japaneseNameJp: '山吹色', japaneseNameEn: 'Yellow' },
    ],
  },
  {
    id: 'item-5',
    imageUrl: colorPlaceholder('#223a70'),
    category: 'Bottom',
    dominantColors: [
      { hex: '#223a70', japaneseNameJp: '紺色', japaneseNameEn: 'Navy' },
    ],
  },
  {
    id: 'item-6',
    imageUrl: colorPlaceholder('#bbbcde'),
    category: 'Dress',
    dominantColors: [
      { hex: '#bbbcde', japaneseNameJp: '藤色', japaneseNameEn: 'Wisteria' },
    ],
  },
  {
    id: 'item-7',
    imageUrl: colorPlaceholder('#4c6cb3'),
    category: 'Outerwear',
    dominantColors: [
      { hex: '#4c6cb3', japaneseNameJp: '群青', japaneseNameEn: 'Ultramarine' },
    ],
  },
  {
    id: 'item-8',
    imageUrl: colorPlaceholder('#e9e4d4'),
    category: 'Top',
    dominantColors: [
      { hex: '#e9e4d4', japaneseNameJp: '灰白', japaneseNameEn: 'Ash White' },
    ],
  },
  {
    id: 'item-9',
    imageUrl: colorPlaceholder('#eb6ea5'),
    category: 'Accessory',
    dominantColors: [
      { hex: '#eb6ea5', japaneseNameJp: '撫子色', japaneseNameEn: 'Pink' },
    ],
  },
  {
    id: 'item-10',
    imageUrl: colorPlaceholder('#928178'),
    category: 'Shoes',
    dominantColors: [
      { hex: '#928178', japaneseNameJp: '丁子色', japaneseNameEn: 'Clove' },
    ],
  },
  {
    id: 'item-11',
    imageUrl: colorPlaceholder('#595857'),
    category: 'Bottom',
    dominantColors: [
      { hex: '#595857', japaneseNameJp: '墨色', japaneseNameEn: 'Ink' },
    ],
  },
  {
    id: 'item-12',
    imageUrl: colorPlaceholder('#c3d825'),
    category: 'Accessory',
    dominantColors: [
      { hex: '#c3d825', japaneseNameJp: '若草色', japaneseNameEn: 'Fresh Green' },
    ],
  },
];

export default dummyWardrobe;
