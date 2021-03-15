// 7seg. hex decoder
Import("7seg_dec,rs,5k,1r;output,12w,46,1;output,14u,46,1;output,16s,46,1;output,17w,5p,1;output,17m,7d,1;output,172,af,1;output,16s,c3,1;output,11s,dm,1;output,13q,dm,1;output,15o,dm,1;output,10o,af,1;output,10e,c3,1;output,11i,5p,1;output,118,7d,1;output,12c,8w,0;output,14a,8w,0;output,168,8w,0;input_high,5k,5f,1;input_clk,5k,7n,0;and,ci,eg,0;and,ci,im,0;jkff,jg,5k,6;jkff,jg,9q,6;jkff,jg,dw,6;jkff,jg,i2,6;;0,1,0,0;0,2,0,0;0,3,0,0;0,4,1,0;0,5,1,0;0,6,2,0;0,7,2,0;0,8,3,0;0,9,3,0;0,a,3,0;0,b,4,0;0,c,4,0;0,d,5,0;0,e,5,0;0,f,6,0;0,g,6,0;0,h,6,0;i,m,0,0;i,m,0,2;j,m,0,1;j,n,0,1;j,o,0,1;j,p,0,1;m,n,0,0;m,n,0,2;m,k,0,0;n,k,0,1;k,o,0,0;k,o,0,2;k,l,0,0;o,l,0,1;l,p,0,0;l,p,0,2;m,0,0,0;n,0,0,1;o,0,0,2;p,0,0,3");

// 4bit counter x4
// Import("not,5k,2d,0;4bit_ctr,go,2s,j;4bit_ctr,go,8c,f;4bit_ctr,go,dw,q;4bit_ctr,go,jg,h;;0,0,0,0;0,1,0,0;1,2,3,0;2,3,3,0;3,4,3,0");

// 4bit + 4bit
// Import("input_high,5k,2s,1;input_high,5k,50,1;input_high,5k,78,1;input_low,5k,9g,0;input_high,5k,dw,1;input_low,5k,g4,0;input_high,5k,ic,1;input_high,5k,kk,1;fa,dw,2x,2;fa,dw,83,2;fa,dw,da,3;fa,dw,ih,2;output,nc,2s,0;output,nc,50,0;output,nc,78,1;output,nc,9g,0;output,nc,kk,1;;0,8,0,0;4,8,0,1;1,9,0,0;5,9,0,1;2,a,0,0;6,a,0,1;3,b,0,0;7,b,0,1;8,9,1,2;9,a,1,2;a,b,1,2;8,c,0,0;9,d,0,0;a,e,0,0;b,f,0,0;b,g,1,0");