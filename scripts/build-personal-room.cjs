// Preserve the original animation's motion; apply generated appearance poses.
// Requires sharp. SHARP_MODULE can point to an existing Sharp installation.
const sharp=require(process.env.SHARP_MODULE || 'sharp');
(async()=>{
 const width=800,height=450,bytes=width*height*4;
 const source=await sharp('assets/pixel-room.gif',{animated:true}).resize(width,height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const metadata=await sharp('assets/pixel-room.gif',{animated:true}).metadata();
 const mask=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><path fill="white" d="M350 270H417L440 291L447 336V367L410 378L400 402H368V378H350V348H343V311Z"/></svg>`);
 const poses=[];
 for(const file of ['assets/aapsi-screen-pose.png','assets/aapsi-turned-pose.png']){
   const image=await sharp(file).resize(width,height,{fit:'fill',kernel:'nearest'}).png().toBuffer();
   poses.push(await sharp(image).composite([{input:mask,blend:'dest-in'}]).png().toBuffer());
 }
 // Track only the source hair, keeping the original head bobbing and body turn.
 function hairCenter(frame){let sx=0,sy=0,n=0;for(let y=268;y<355;y++)for(let x=345;x<444;x++){let p=(y*width+x)*4,r=frame[p],g=frame[p+1],b=frame[p+2];if(r>12&&r<65&&g<30&&b<75&&r>g*1.4&&r>b*.6){sx+=x;sy+=y;n++;}}return {x:sx/n,y:sy/n};}
 const anchors=[hairCenter(source.data.subarray(0,bytes)),hairCenter(source.data.subarray(12*bytes,13*bytes))];
 const frames=[];
 for(let i=0;i<metadata.pages;i++){
   const frame=source.data.subarray(i*bytes,(i+1)*bytes);
   const pose=i>=1&&i<=24?1:0;
   const center=hairCenter(frame),anchor=anchors[pose];
   const dx=Math.max(-4,Math.min(4,Math.round(center.x-anchor.x))),dy=Math.max(-4,Math.min(4,Math.round(center.y-anchor.y)));
   const shifted=await sharp(poses[pose]).affine([[1,0],[0,1]],{odx:dx,ody:dy,background:'#00000000'}).png().toBuffer();
   // Preserve original foreground hands and drink pixels where long hair overlaps.
   // No generated arm path, detached hand sprite, or independently moving drink.
   const foreground=Buffer.alloc(bytes);
   for(let y=318;y<380;y++)for(let x=320;x<480;x++){
     const inHands=(x>=416)||(x<=386&&y>=347);if(!inHands)continue;
     const p=(y*width+x)*4,r=frame[p],g=frame[p+1],b=frame[p+2];
     const warm=r>65&&r>g*1.15&&r>b*1.02;
     const label=r>145&&g>125&&b>125&&Math.max(r,g,b)-Math.min(r,g,b)<85;
     if(warm||label){foreground[p]=r;foreground[p+1]=g;foreground[p+2]=b;foreground[p+3]=255;}
   }
   const front=await sharp(foreground,{raw:{width,height,channels:4}}).png().toBuffer();
   frames.push(await sharp(frame,{raw:{width,height,channels:4}}).composite([{input:shifted},{input:front}]).raw().toBuffer());
 }
 await sharp(Buffer.concat(frames),{raw:{width,height:height*frames.length,channels:4,pageHeight:height}}).gif({loop:0,delay:metadata.delay,colours:256,dither:0,effort:8}).toFile('assets/aapsi-pixel-room.gif');
 await sharp(frames[0],{raw:{width,height,channels:4}}).png().toFile('assets/aapsi-pixel-room-still.png');
 console.log('Built 49 frames preserving the original hand/drink motion and synchronized head orientation.');
})();
