# Personalized pixel room

Generated with the built-in image-generation tool, using the public GitHub avatar at `https://avatars.githubusercontent.com/u/39875852?v=4` as the identity reference and the original room as the edit target. The source photo is not committed.

## Final generation prompt

Use case: identity-preserve / precise-object-edit. Edit target: Image 1, the existing 1920x1080 pixel-art gaming room. Identity reference: Image 2, the user's actual GitHub profile portrait. Replace ONLY the seated human gamer in the lower middle of Image 1 with a pixel-art version of the woman in Image 2. Preserve her recognizable long straight dark center-parted hair, warm medium complexion, facial likeness, black long-sleeved top and subtle necklace. Make her seated at exactly the same desk in the same position and scale as the original gamer, facing left toward the code monitor, with a slight three-quarter face angle and friendly expression. Preserve the mushroom chair and keyboard pose. Match Image 1's genuine chunky 8px pixel grid and tightly limited dark blue/purple game palette; no smooth painting, no vector, no photorealistic pasted face. Critical production constraints: output the entire room in exactly the same 16:9 framing, no camera move, no crop, no resizing/repositioning of any room element. All pixels outside the seated character region (approximately x=720..1090, y=650..1079 in the 1920x1080 image) should remain visually unchanged. Do not change the shelves, game characters, monitors, posters, window, lighting, or any text. The existing animated room will be retained around your edited character; exact registration matters. Deliver one full-room edited PNG.

## Animation assembly

`scripts/build-personal-room.cjs` combines the generated character region with each original room frame. The room retains its 49 frames at 100 ms each, looping indefinitely. The likeness remains registered in place; a connected sleeve/hand/drink rig animates the reach, sip, and return. The old desk-bottle motion is removed using an empty-desk region from the original animation. The result is 800×450; the still is its reduced-motion counterpart.

Outputs: `aapsi-pixel-room.gif`, `aapsi-pixel-room-still.png`. The unmodified generated output is `aapsi-room-source.png`.

To rebuild with Node.js and Sharp installed: `node scripts/build-personal-room.cjs`. Alternatively, set `SHARP_MODULE` to an existing Sharp installation.


## Drinking-action correction

A second built-in image-generation edit supplied reaching, lifting, sipping, and returning poses in `aapsi-drinking-source.png`. The sheet serves as motion/art reference and supplies the isolated grip sprite (`aapsi-drink-grip.png`); its room layout is not substituted into the animation. The assembly script connects the sleeve, grip, and drink throughout a smooth path and rotates the opening toward the lips. The original bottle is absent during the sip and restored to its desk position on return.

Final generation prompt:

Precise animation sprite-sheet edit. The reference is a personalized pixel-art gaming-room frame. Deliver a perfectly registered 2 by 2 contact sheet of FOUR frames of this EXACT full scene, in row-major order, with NO gaps, NO labels, NO borders, and no camera changes. Overall canvas 1600x900; each equal tile is the entire 800x450 reference scene. Preserve the room, seated woman's likeness, long dark hair, black top, mushroom chair, face position, body placement, palette, chunky pixels, and all background elements identically across all four frames. ONLY animate her near/right arm and the existing red-and-white Diet Coke drink on the desk just to the right of her chair. Keep her other hand at the keyboard. TOP LEFT = reaching right and grasping the upright drink on the desk. TOP RIGHT = holding the drink in the hand, lifted halfway between the desk and mouth, elbow naturally bent, drink moving in front of the torso. BOTTOM LEFT = taking a sip with the drink opening physically touching the lips, drink tilted toward the mouth, hand visibly gripping it, elbow lowered naturally. BOTTOM RIGHT = lowering the drink back toward its original desk position, still firmly held. Exactly one drink exists in each frame; the original desk spot is EMPTY whenever the drink is held up. No floating drink, no detached hand, no extra limbs, no ghost images. The woman's head and chair must stay perfectly fixed in place between frames. Use genuine crisp low-resolution pixel animation, not smooth illustration. This will be sliced into real animation keyframes; registration and physically connected hand/drink motion are essential.
