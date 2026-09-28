# Profile artwork

The welcome SVGs are repository-owned vector artwork. Each runs one short signal animation and then rests. Reduced-motion preferences show the completed, static diagram. Separate mobile layouts and light/dark palettes are selected by the profile's `picture` element.

To regenerate after editing `scripts/generate-welcome.cjs`:

```sh
npm ci
npm run generate
```

Lettering uses Space Grotesk, converted to paths so SVG images need no font requests. The source font comes from [Google Fonts](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) and is distributed under the included SIL Open Font License in `OFL-SpaceGrotesk.txt`.

`activity-static.svg` is a reduced-motion alternative to the existing contribution arcade. The Pac-Man workflow and its output branch are maintained separately.
