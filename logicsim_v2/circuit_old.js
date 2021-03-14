
// // full adder
// CreateEntity("input_high", 200, 215);
// CreateEntity("input_low", 200, 365);
// CreateEntity("input_high", 200, 515);
// CreateEntity("xor", 600, 200);
// CreateEntity("and", 600, 350);
// CreateEntity("xor", 1000, 200);
// CreateEntity("and", 1000, 350);
// CreateEntity("or", 1000, 500);
// CreateEntity("output", 1400, 215);
// CreateEntity("output", 1400, 515);
// CreateWire(0, 3, 0, 0);
// CreateWire(0, 4, 0, 0);
// CreateWire(1, 3, 0, 1);
// CreateWire(1, 4, 0, 1);
// CreateWire(2, 5, 0, 1);
// CreateWire(2, 6, 0, 1);
// CreateWire(3, 5, 0, 0);
// CreateWire(3, 6, 0, 0);
// CreateWire(4, 7, 0, 1);
// CreateWire(5, 8, 0, 0);
// CreateWire(6, 7, 0, 0);
// CreateWire(7, 9, 0, 0);

// // and full adder chip
// CreateEntity("fa", 800, 600);
// CreateWire(0, 10, 0, 0);
// CreateWire(1, 10, 0, 1);
// CreateWire(2, 10, 0, 2);

// // 4bit + 4bit
// CreateEntity("input_high", 200, 100);
// CreateEntity("input_high", 200, 180);
// CreateEntity("input_high", 200, 260);
// CreateEntity("input_low", 200, 340);
// CreateEntity("input_high", 200, 500);
// CreateEntity("input_low", 200, 580);
// CreateEntity("input_high", 200, 660);
// CreateEntity("input_high", 200, 740);
// CreateEntity("fa", 500, 105);
// CreateEntity("fa", 500, 291);
// CreateEntity("fa", 500, 478);
// CreateEntity("fa", 500, 665);
// CreateEntity("output", 840, 100);
// CreateEntity("output", 840, 180);
// CreateEntity("output", 840, 260);
// CreateEntity("output", 840, 340);
// CreateEntity("output", 840, 740);
// CreateWire(0, 8, 0, 0);
// CreateWire(4, 8, 0, 1);
// CreateWire(1, 9, 0, 0);
// CreateWire(5, 9, 0, 1);
// CreateWire(2, 10, 0, 0);
// CreateWire(6, 10, 0, 1);
// CreateWire(3, 11, 0, 0);
// CreateWire(7, 11, 0, 1);
// CreateWire(8, 9, 1, 2);
// CreateWire(9, 10, 1, 2);
// CreateWire(10, 11, 1, 2);
// CreateWire(8, 12, 0, 0);
// CreateWire(9, 13, 0, 0);
// CreateWire(10, 14, 0, 0);
// CreateWire(11, 15, 0, 0);
// CreateWire(11, 16, 1, 0);

// CreateEntity("4bit_add", 1200, 100);
// CreateWire(0, 17, 0, 0);
// CreateWire(1, 17, 0, 1);
// CreateWire(2, 17, 0, 2);
// CreateWire(3, 17, 0, 3);
// CreateWire(4, 17, 0, 4);
// CreateWire(5, 17, 0, 5);
// CreateWire(6, 17, 0, 6);
// CreateWire(7, 17, 0, 7);

// // 10-frame loop
// CreateEntity("not", 150, 190);
// CreateEntity("output", 350, 250);
// CreateEntity("output", 500, 300);
// CreateEntity("output", 650, 350);
// CreateEntity("output", 800, 400);
// CreateEntity("output", 950, 450);
// CreateEntity("output", 1100, 500);
// CreateEntity("output", 1250, 550);
// CreateEntity("output", 1400, 600);
// CreateEntity("output", 1550, 650);
// CreateWire(0, 1, 0, 0);
// CreateWire(1, 2, 0, 0);
// CreateWire(2, 3, 0, 0);
// CreateWire(3, 4, 0, 0);
// CreateWire(4, 5, 0, 0);
// CreateWire(5, 6, 0, 0);
// CreateWire(6, 7, 0, 0);
// CreateWire(7, 8, 0, 0);
// CreateWire(8, 9, 0, 0);
// CreateWire(9, 0, 0, 0);

// // synchronized octal counter
// CreateEntity("input_high", 200, 380);
// CreateEntity("input_clk", 200, 220);
// CreateEntity("jkff", 400, 305);
// CreateEntity("jkff", 600, 305);
// CreateEntity("jkff", 940, 305);
// CreateEntity("and", 760, 310);
// CreateWire(0, 2, 0, 0);
// CreateWire(0, 2, 0, 2);
// CreateWire(1, 2, 0, 1);
// CreateWire(1, 3, 0, 1);
// CreateWire(1, 4, 0, 1);
// CreateWire(2, 3, 0, 0);
// CreateWire(2, 3, 0, 2);
// CreateWire(2, 5, 0, 1);
// CreateWire(3, 5, 0, 0);
// CreateWire(5, 4, 0, 0);
// CreateWire(5, 4, 0, 2);

// CreateEntity("output", 600, 220);
// CreateEntity("output", 800, 220);
// CreateEntity("output", 1140, 220);
// CreateWire(2, 6, 0, 0);
// CreateWire(3, 7, 0, 0);
// CreateWire(4, 8, 0, 0);

// // 7seg. hex decoder
// CreateEntity("7seg_dec", 1000, 200);
// // a
// CreateEntity("output", 1400, 150);
// CreateEntity("output", 1470, 150);
// CreateEntity("output", 1540, 150);
// // b
// CreateEntity("output", 1580, 205);
// CreateEntity("output", 1570, 265);
// // c
// CreateEntity("output", 1550, 375);
// CreateEntity("output", 1540, 435);
// // d
// CreateEntity("output", 1360, 490);
// CreateEntity("output", 1430, 490);
// CreateEntity("output", 1500, 490);
// // e
// CreateEntity("output", 1320, 375);
// CreateEntity("output", 1310, 435);
// // f
// CreateEntity("output", 1350, 205);
// CreateEntity("output", 1340, 265);
// // g
// CreateEntity("output", 1380, 320);
// CreateEntity("output", 1450, 320);
// CreateEntity("output", 1520, 320);

// CreateEntity("input_high", 200, 195);
// CreateEntity("input_clk", 200, 275);
// CreateEntity("and", 450, 520)
// CreateEntity("and", 450, 670)
// CreateEntity("jkff", 700, 200);
// CreateEntity("jkff", 700, 350);
// CreateEntity("jkff", 700, 500);
// CreateEntity("jkff", 700, 650);

// CreateWire(0, 1, 0, 0);
// CreateWire(0, 2, 0, 0);
// CreateWire(0, 3, 0, 0);
// CreateWire(0, 4, 1, 0);
// CreateWire(0, 5, 1, 0);
// CreateWire(0, 6, 2, 0);
// CreateWire(0, 7, 2, 0);
// CreateWire(0, 8, 3, 0);
// CreateWire(0, 9, 3, 0);
// CreateWire(0, 10, 3, 0);
// CreateWire(0, 11, 4, 0);
// CreateWire(0, 12, 4, 0);
// CreateWire(0, 13, 5, 0);
// CreateWire(0, 14, 5, 0);
// CreateWire(0, 15, 6, 0);
// CreateWire(0, 16, 6, 0);
// CreateWire(0, 17, 6, 0);

// CreateWire(18, 22, 0, 0);
// CreateWire(18, 22, 0, 2);
// CreateWire(19, 22, 0, 1);
// CreateWire(19, 23, 0, 1);
// CreateWire(19, 24, 0, 1);
// CreateWire(19, 25, 0, 1);
// CreateWire(22, 23, 0, 0);
// CreateWire(22, 23, 0, 2);
// CreateWire(22, 20, 0, 0);
// CreateWire(23, 20, 0, 1);
// CreateWire(20, 24, 0, 0);
// CreateWire(20, 24, 0, 2);
// CreateWire(20, 21, 0, 0);
// CreateWire(24, 21, 0, 1);
// CreateWire(21, 25, 0, 0);
// CreateWire(21, 25, 0, 2);
// CreateWire(22, 0, 0, 0);
// CreateWire(23, 0, 0, 1);
// CreateWire(24, 0, 0, 2);
// CreateWire(25, 0, 0, 3);

// // some FF test
// CreateEntity("input_clk", 185, 110);
// CreateEntity("4bit_ctr", 300, 115);
// CreateEntity("input_clk", 550, 335);
// CreateEntity("jkff", 800, 100);
// CreateEntity("dff", 800, 300);
// CreateEntity("tff", 800, 500);
// CreateEntity("or", 500, 120);
// CreateWire(0, 1, 0, 0);
// CreateWire(1, 6, 0, 0);
// CreateWire(1, 6, 1, 1);
// CreateWire(6, 3, 0, 0);
// CreateWire(6, 3, 0, 2);
// CreateWire(6, 4, 0, 0);
// CreateWire(6, 5, 0, 0);
// CreateWire(2, 3, 0, 1);
// CreateWire(2, 4, 0, 1);
// CreateWire(2, 5, 0, 1);

// // 4bit ctr IC
// CreateEntity("not", 200, 85);
// CreateEntity("4bit_ctr", 600, 100);
// CreateEntity("4bit_ctr", 600, 300);
// CreateEntity("4bit_ctr", 600, 500);
// CreateEntity("4bit_ctr", 600, 700);
// CreateWire(0, 0, 0, 0);
// CreateWire(0, 1, 0, 0);
// CreateWire(1, 2, 3, 0);
// CreateWire(2, 3, 3, 0);
// CreateWire(3, 4, 3, 0);