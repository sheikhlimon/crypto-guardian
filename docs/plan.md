# Crypto Guardian — Plan

## Broken / Needs Fix

- [ ] Backend uses `tsx` without `watch` flag — no hot reload during development
- [ ] BlockCypher returns incomplete data for some addresses (reports ~1/3 of actual total received for high-volume BTC addresses)
- [ ] No error feedback to user when API call fails silently (App.tsx sets result to null with no message)
- [ ] No tests — no test runner, no test files, no test scripts

## Missing

- [ ] Error handling in UI — failed API calls show nothing (no error banner, no retry)
- [ ] Loading states could be clearer (no progress indication for which step is running)
- [ ] No `.env.example` with all config options documented
- [ ] No deployment config (Dockerfile, render.yaml, etc.)

## Done

- [x] Risk analyzer rewritten — uses drain detection instead of raw tx count
- [x] Price API switched from CoinGecko to Blockchain.info + Coinbase
- [x] BigInt conversion fixed for large wei values
- [x] Duplicate loading spinner removed from input field
- [x] Warmup endpoint no longer re-initializes price cache
- [x] Duplicate console logs removed
