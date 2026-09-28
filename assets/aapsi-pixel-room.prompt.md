# Personalized pixel room — original-pose revision

Created with the built-in image-generation tool. The public GitHub avatar supplies the character identity; the original room’s frames 0 and 12 supply the exact viewing direction and posture. The source portrait is not committed.

## Final prompts

Shared prompt for both edits:

Precise identity-preserving pixel-art edit. Image 1 is the edit target, an original animation frame. Image 2 is the identity reference, the user's portrait. Preserve the EXACT scene framing, camera, pixel grid, head position, body proportions, shoulder position, arms, hands, chair, desk, and EVERY background element of Image 1. Change ONLY the character's head/hair to depict the woman in Image 2 with long straight dark hair and her complexion, and change the existing shirt to black. Extremely important: copy the original character's exact gaze and head orientation, do not pose for the camera, do not show a frontal face or a smile at the viewer, no giant anime eyes, no chibi face. Use the same coarse 8-pixel block art as the original, a limited palette, no smooth gradients or detailed hair strands. Keep long hair neatly falling down the back so it does not hide the working hand, the drink, or the chair. Do not reposition or redesign any arm, hand, drink, or body part; preserve the original gesture exactly. This image is a registered animation appearance layer, not a new composition. Output one full-scene PNG in exactly the original 16:9 composition.

Screen-facing edit:

In this frame, the character looks toward the computer screen at upper left. We see the back and right side of her head with only a narrow sliver of left-pointing cheek/nose visible. Her eye line must go into the monitor, never toward the viewer. Preserve the original keyboard-working posture.

Turned edit:

In this frame the original character has turned toward the drink, so the camera sees the BACK OF THE HEAD. Keep that exact orientation: long dark hair at the back, no visible eyes or frontal face. Preserve the already-raised hand at the character's right and the original turned posture exactly.

## Assets and animation assembly

- `aapsi-screen-pose.png`: generated screen-facing appearance.
- `aapsi-turned-pose.png`: generated turned appearance.
- `aapsi-pixel-room.gif`: final 800×450, 49-frame, 100 ms/frame infinite loop.
- `aapsi-pixel-room-still.png`: matching reduced-motion frame.

`scripts/build-personal-room.cjs` applies the two appearance poses to the original animation. It tracks the original head movement, switches orientation with the source turn, and preserves the source’s foreground hands and drink. The old custom arm rig is removed. This preserves the original action instead of simulating a separate pickup path.

Rebuild with Node.js and Sharp: `node scripts/build-personal-room.cjs`. `SHARP_MODULE` can point to an existing Sharp installation.
