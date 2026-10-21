// Self-check for the query builder and finish pricing. Run: npm run check
import assert from 'node:assert/strict';
import type { ScryfallCard } from '../types';
import { DEFAULT_FILTERS, POPULAR_QUERY, buildScryfallQuery, cardPrice, pricedFinish } from './scryfall';

const q = (patch: Partial<typeof DEFAULT_FILTERS>, text = '') => buildScryfallQuery({ ...DEFAULT_FILTERS, ...patch }, text).q;

assert.equal(q({}), POPULAR_QUERY, 'no text and no filters opens on the popular query');
assert.equal(q({}, '  sol ring '), 'sol ring');
assert.equal(q({ art: ['showcase'] }), 'frame:showcase', 'filters alone replace the popular query');
assert.equal(
  q({ art: ['borderless', 'showcase'], finish: 'etched', artist: ' Rebecca "Guay" ' }, '!"Sol Ring"'),
  '!"Sol Ring" is:etched (frame:showcase or border:borderless) a:"Rebecca Guay"',
);
assert.equal(q({ rarity: ['mythic', 'rare'] }), '(r:mythic or r:rare)');

const card = (prices: ScryfallCard['prices']) => ({ prices }) as ScryfallCard;
const etchedOnly = card({ usd: null, usd_foil: null, usd_etched: '0.42' });
assert.equal(pricedFinish(etchedOnly), 'etched', 'etched-only printings sell as etched');
assert.equal(cardPrice(etchedOnly), 0.42);

const both = card({ usd: '1.00', usd_foil: '3.50' });
assert.equal(pricedFinish(both), 'nonfoil');
assert.equal(cardPrice(both, 'foil'), 3.5);
assert.equal(pricedFinish(both, 'etched'), 'nonfoil', 'a missing preferred finish falls back to one with a price');
assert.equal(cardPrice(card({ usd: null })), null);

console.log('scryfall.check: ok');
