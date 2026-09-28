// Assemble the image-generated character edit with the existing room's motion.
// Requires sharp. SHARP_MODULE may point to an existing project installation.
const fs=require('node:fs');
const sharp=require(process.env.SHARP_MODULE || 'sharp');
(async()=>{
 const width=800,height=450;
 const source=await sharp('assets/pixel-room.gif',{animated:true}).resize(width,height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const metadata=await sharp('assets/pixel-room.gif',{animated:true}).metadata();
 const generated=await sharp('assets/aapsi-room-source.png').resize(width,height,{fit:'fill',kernel:'nearest'}).png().toBuffer();
 // Include both old and new character silhouettes so no original character remains.
 // Everything outside this foreground mask is an original animation pixel.
 const mask=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><path fill="white" d="M350 270H418L442 296L450 340L458 369H465V450H300V416L322 393H358V380H326V354H348V341L340 330V305Z"/></svg>`);
 const overlay=await sharp(generated).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
 const frames=[],bytes=width*height*4;
 for(let i=0;i<metadata.pages;i++){
   const frame=source.data.subarray(i*bytes,(i+1)*bytes);
   frames.push(await sharp(frame,{raw:{width,height,channels:4}}).composite([{input:overlay}]).raw().toBuffer());
 }
 const raw=Buffer.concat(frames);
 await sharp(raw,{raw:{width,height:height*frames.length,channels:4,pageHeight:height}}).gif({loop:0,delay:metadata.delay,colours:256,dither:0,effort:8}).toFile('assets/aapsi-pixel-room.gif');
 await sharp(frames[0],{raw:{width,height,channels:4}}).png().toFile('assets/aapsi-pixel-room-still.png');
 console.log(JSON.stringify(await sharp('assets/aapsi-pixel-room.gif',{animated:true}).metadata()));
})();
