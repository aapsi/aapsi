# Personalized pixel room

Generated with the built-in image-generation tool, using the public GitHub avatar at `https://avatars.githubusercontent.com/u/39875852?v=4` as the identity reference and the original room as the edit target. The source photo is not committed.

## Final generation prompt

Use case: identity-preserve / precise-object-edit. Edit target: Image 1, the existing 1920x1080 pixel-art gaming room. Identity reference: Image 2, the user's actual GitHub profile portrait. Replace ONLY the seated human gamer in the lower middle of Image 1 with a pixel-art version of the woman in Image 2. Preserve her recognizable long straight dark center-parted hair, warm medium complexion, facial likeness, black long-sleeved top and subtle necklace. Make her seated at exactly the same desk in the same position and scale as the original gamer, facing left toward the code monitor, with a slight three-quarter face angle and friendly expression. Preserve the mushroom chair and keyboard pose. Match Image 1's genuine chunky 8px pixel grid and tightly limited dark blue/purple game palette; no smooth painting, no vector, no photorealistic pasted face. Critical production constraints: output the entire room in exactly the same 16:9 framing, no camera move, no crop, no resizing/repositioning of any room element. All pixels outside the seated character region (approximately x=720..1090, y=650..1079 in the 1920x1080 image) should remain visually unchanged. Do not change the shelves, game characters, monitors, posters, window, lighting, or any text. The existing animated room will be retained around your edited character; exact registration matters. Deliver one full-room edited PNG.

## Animation assembly

`scripts/build-personal-room.cjs` combines the generated character region with each original room frame. The room retains its 49 frames at 100 ms each, looping indefinitely. The personalized character is static within the moving scene. The result is 800×450; the still is its reduced-motion counterpart.

Outputs: `aapsi-pixel-room.gif`, `aapsi-pixel-room-still.png`. The unmodified generated output is `aapsi-room-source.png`.

To rebuild with Node.js and Sharp installed: `node scripts/build-personal-room.cjs`. Alternatively, set `SHARP_MODULE` to an existing Sharp installation.
