/**
 * Dummy combination data for the Kasane frontend.
 *
 * Shape matches the backend contract:
 * { id, nameJp, nameEn, season, colors: [{hex, nameJp, nameEn, romaji}], completionOwned, completionTotal }
 */

const dummyCombinations = [
  {
    id: 'combo-1',
    nameJp: '春曙',
    nameEn: 'Spring Dawn',
    season: 'Spring',
    colors: [
      { hex: '#ef4523', nameJp: '朱色', nameEn: 'Vermillion', romaji: 'Shu-iro' },
      { hex: '#a8d8cb', nameJp: '青磁色', nameEn: 'Celadon', romaji: 'Seiji-iro' },
      { hex: '#fef4f4', nameJp: '桜色', nameEn: 'Cherry Blossom', romaji: 'Sakura-iro' },
    ],
    completionOwned: 3,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-2',
    nameJp: '秋空',
    nameEn: 'Autumn Sky',
    season: 'Autumn',
    colors: [
      { hex: '#f8b500', nameJp: '山吹色', nameEn: 'Yellow', romaji: 'Yamabuki-iro' },
      { hex: '#223a70', nameJp: '紺色', nameEn: 'Navy', romaji: 'Kon-iro' },
    ],
    completionOwned: 2,
    completionTotal: 2,
    locked: false,
  },
  {
    id: 'combo-3',
    nameJp: '冬霞',
    nameEn: 'Winter Mist',
    season: 'Winter',
    colors: [
      { hex: '#fef4f4', nameJp: '桜色', nameEn: 'Cherry Blossom', romaji: 'Sakura-iro' },
      { hex: '#bbbcde', nameJp: '藤色', nameEn: 'Wisteria', romaji: 'Fuji-iro' },
      { hex: '#c3d825', nameJp: '若草色', nameEn: 'Fresh Green', romaji: 'Waka-kusa-iro' },
    ],
    completionOwned: 2,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-4',
    nameJp: '夏祭',
    nameEn: 'Summer Festival',
    season: 'Summer',
    colors: [
      { hex: '#c3d825', nameJp: '若草色', nameEn: 'Fresh Green', romaji: 'Waka-kusa-iro' },
      { hex: '#eb6ea5', nameJp: '撫子色', nameEn: 'Pink', romaji: 'Nadeshiko-iro' },
    ],
    completionOwned: 1,
    completionTotal: 2,
    locked: false,
  },
  {
    id: 'combo-5',
    nameJp: '雪月花',
    nameEn: 'Snowy Moonflower',
    season: 'Winter',
    colors: [
      { hex: '#4c6cb3', nameJp: '群青', nameEn: 'Ultramarine', romaji: 'Gunjō' },
      { hex: '#e9e4d4', nameJp: '灰白', nameEn: 'Ash White', romaji: 'Haijiro' },
      { hex: '#ef4523', nameJp: '朱色', nameEn: 'Vermillion', romaji: 'Shu-iro' },
    ],
    completionOwned: 3,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-6',
    nameJp: '藤雲',
    nameEn: 'Wisteria Cloud',
    season: 'Spring',
    colors: [
      { hex: '#bbbcde', nameJp: '藤色', nameEn: 'Wisteria', romaji: 'Fuji-iro' },
      { hex: '#928178', nameJp: '丁子色', nameEn: 'Clove', romaji: 'Chōji-iro' },
      { hex: '#fef4f4', nameJp: '桜色', nameEn: 'Cherry Blossom', romaji: 'Sakura-iro' },
    ],
    completionOwned: 1,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-7',
    nameJp: '墨夜',
    nameEn: 'Ink Night',
    season: 'Autumn',
    colors: [
      { hex: '#595857', nameJp: '墨色', nameEn: 'Ink', romaji: 'Sumi-iro' },
      { hex: '#223a70', nameJp: '紺色', nameEn: 'Navy', romaji: 'Kon-iro' },
      { hex: '#e9e4d4', nameJp: '灰白', nameEn: 'Ash White', romaji: 'Haijiro' },
    ],
    completionOwned: 2,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-8',
    nameJp: '花野',
    nameEn: 'Flower Field',
    season: 'Summer',
    colors: [
      { hex: '#eb6ea5', nameJp: '撫子色', nameEn: 'Pink', romaji: 'Nadeshiko-iro' },
      { hex: '#a8d8cb', nameJp: '青磁色', nameEn: 'Celadon', romaji: 'Seiji-iro' },
      { hex: '#f8b500', nameJp: '山吹色', nameEn: 'Yellow', romaji: 'Yamabuki-iro' },
    ],
    completionOwned: 2,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-9',
    nameJp: '紅葉狩',
    nameEn: 'Autumn Leaves',
    season: 'Autumn',
    colors: [
      { hex: '#ef4523', nameJp: '朱色', nameEn: 'Vermillion', romaji: 'Shu-iro' },
      { hex: '#f8b500', nameJp: '山吹色', nameEn: 'Yellow', romaji: 'Yamabuki-iro' },
      { hex: '#928178', nameJp: '丁子色', nameEn: 'Clove', romaji: 'Chōji-iro' },
    ],
    completionOwned: 3,
    completionTotal: 3,
    locked: false,
  },
  {
    id: 'combo-10',
    nameJp: '青嵐',
    nameEn: 'Blue Storm',
    season: 'Summer',
    colors: [
      { hex: '#4c6cb3', nameJp: '群青', nameEn: 'Ultramarine', romaji: 'Gunjō' },
      { hex: '#c3d825', nameJp: '若草色', nameEn: 'Fresh Green', romaji: 'Waka-kusa-iro' },
    ],
    completionOwned: 1,
    completionTotal: 2,
    locked: false,
  },
];

export default dummyCombinations;
