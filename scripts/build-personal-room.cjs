// Assemble the generated pixel likeness with a connected reach–sip–return rig.
// Requires sharp. SHARP_MODULE can point to an existing Sharp installation.
const sharp=require(process.env.SHARP_MODULE || 'sharp');
(async()=>{
 const width=800,height=450,bytes=width*height*4;
 const source=await sharp('assets/pixel-room.gif',{animated:true}).resize(width,height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const metadata=await sharp('assets/pixel-room.gif',{animated:true}).metadata();
 const generated=await sharp('assets/aapsi-room-source.png').resize(width,height,{fit:'fill',kernel:'nearest'}).png().toBuffer();
 const mask=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><path fill="white" d="M350 270H418L442 296L450 340L458 369H465V450H300V416L322 393H358V380H326V354H348V341L340 330V305Z"/></svg>`);
 const portrait=await sharp(generated).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
 // Original frame 12 has an empty desk here. Freeze this region to suppress
 // the old character's bottle/arm action before drawing the replacement rig.
 const cleanDesk=await sharp(source.data.subarray(12*bytes,13*bytes),{raw:{width,height,channels:4}}).extract({left:451,top:324,width:65,height:60}).png().toBuffer();
 // Extract the connected hand + drink sprite from the generated reaching pose.
 const grip=await sharp('assets/aapsi-drinking-source.png').extract({left:568,top:402,width:30,height:40}).resize(24,32,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
 for(let i=0;i<grip.length;i+=4){const r=grip[i],g=grip[i+1],b=grip[i+2];const red=r>38&&r>g*1.3&&r>b*1.12;const pale=r>145&&g>125&&b>125;grip[i+3]=(red||pale)?255:0;}
 const gripPng=await sharp(grip,{raw:{width:24,height:32,channels:4}}).png().toBuffer();
 await sharp(gripPng).toFile('assets/aapsi-drink-grip.png');
 const smooth=t=>t*t*(3-2*t);
 const frames=[];
 for(let i=0;i<metadata.pages;i++){
   let t=i<7?0:i<17?smooth((i-7)/10):i<25?1:i<35?1-smooth((i-25)/10):0;
   const x=465-102*t,y=361-20*t-29*Math.sin(Math.PI*t),angle=50*t;
   const rad=angle*Math.PI/180;
   const hand={x:x-7*Math.cos(rad),y:y-7*Math.sin(rad)};
   const elbow={x:440-54*t,y:359+16*t};
   // Build the sleeve on the room's coarse pixel grid, then scale without blur.
   const armSvg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="135" viewBox="0 0 800 450"><path d="M414 351L${elbow.x} ${elbow.y}L${hand.x} ${hand.y}" fill="none" stroke="#090a12" stroke-width="14" stroke-linejoin="round" stroke-linecap="square"/><path d="M415 347L${elbow.x} ${elbow.y-4}L${hand.x} ${hand.y-3}" fill="none" stroke="#201827" stroke-width="3" stroke-linejoin="round"/></svg>`);
   const arm=await sharp(armSvg).resize(width,height,{kernel:'nearest'}).png().toBuffer();
   // Clockwise tilt puts the opening against the character's lips at full sip.
   const drink=await sharp(gripPng).rotate(angle,{background:'#00000000'}).png().toBuffer({resolveWithObject:true});
   const frame=source.data.subarray(i*bytes,(i+1)*bytes);
   frames.push(await sharp(frame,{raw:{width,height,channels:4}}).composite([
    {input:portrait},{input:cleanDesk,left:451,top:324},{input:arm},
    {input:drink.data,left:Math.round(x-drink.info.width/2),top:Math.round(y-drink.info.height/2)}
   ]).raw().toBuffer());
 }
 await sharp(Buffer.concat(frames),{raw:{width,height:height*frames.length,channels:4,pageHeight:height}}).gif({loop:0,delay:metadata.delay,colours:256,dither:0,effort:8}).toFile('assets/aapsi-pixel-room.gif');
 await sharp(frames[0],{raw:{width,height,channels:4}}).png().toFile('assets/aapsi-pixel-room-still.png');
 for(const i of [0,12,20,30])await sharp(frames[i],{raw:{width,height,channels:4}}).png().toFile(`.impeccable/review/drink-frame-${i}.png`);
 console.log('Built 49 frames: held drink at desk → lift → sip → return; old bottle suppressed.');
})();
