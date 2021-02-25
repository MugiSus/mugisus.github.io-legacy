
// // full adder
// CreateEntity(INPUT_HIGH, 200, 215);
// CreateEntity(INPUT_CLK, 200, 365);
// CreateEntity(INPUT_HIGH, 200, 515);
// CreateEntity(XOR, 600, 200);
// CreateEntity(AND, 600, 350);
// CreateEntity(XOR, 1000, 200);
// CreateEntity(AND, 1000, 350);
// CreateEntity(OR, 1000, 500);
// CreateEntity(OUTPUT, 1400, 215);
// CreateEntity(OUTPUT, 1400, 515);
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
// CreateEntity(JKFF, 800, 600);
// CreateWire(0, 10, 0, 0);
// CreateWire(1, 10, 0, 1);
// CreateWire(2, 10, 0, 2);

// // 4bit + 4bit
// CreateEntity(INPUT_HIGH, 200, 100);
// CreateEntity(INPUT_HIGH, 200, 180);
// CreateEntity(INPUT_HIGH, 200, 260);
// CreateEntity(INPUT_HIGH, 200, 340);
// CreateEntity(INPUT_HIGH, 200, 500);
// CreateEntity(INPUT_LOW, 200, 580);
// CreateEntity(INPUT_LOW, 200, 660);
// CreateEntity(INPUT_LOW, 200, 740);
// CreateEntity(FA, 500, 105);
// CreateEntity(FA, 500, 291);
// CreateEntity(FA, 500, 478);
// CreateEntity(FA, 500, 665);
// CreateEntity(OUTPUT, 840, 100);
// CreateEntity(OUTPUT, 840, 180);
// CreateEntity(OUTPUT, 840, 260);
// CreateEntity(OUTPUT, 840, 340);
// CreateEntity(OUTPUT, 840, 740);
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

// // 10-frame loop
// CreateEntity(NOT, 150, 190);
// CreateEntity(OUTPUT, 350, 250);
// CreateEntity(OUTPUT, 500, 300);
// CreateEntity(OUTPUT, 650, 350);
// CreateEntity(OUTPUT, 800, 400);
// CreateEntity(OUTPUT, 950, 450);
// CreateEntity(OUTPUT, 1100, 500);
// CreateEntity(OUTPUT, 1250, 550);
// CreateEntity(OUTPUT, 1400, 600);
// CreateEntity(OUTPUT, 1550, 650);
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
// CreateEntity(INPUT_HIGH, 200, 380);
// CreateEntity(INPUT_CLK, 200, 220);
// CreateEntity(JKFF, 400, 305);
// CreateEntity(JKFF, 600, 305);
// CreateEntity(JKFF, 940, 305);
// CreateEntity(AND, 760, 310);
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

// CreateEntity(OUTPUT, 600, 220);
// CreateEntity(OUTPUT, 800, 220);
// CreateEntity(OUTPUT, 1140, 220);
// CreateWire(2, 6, 0, 0);
// CreateWire(3, 7, 0, 0);
// CreateWire(4, 8, 0, 0);

// 7seg. hex decoder
CreateEntity(_7SEG_DEC, 1000, 200);
// a
CreateEntity(OUTPUT, 1400, 150);
CreateEntity(OUTPUT, 1470, 150);
CreateEntity(OUTPUT, 1540, 150);
// b
CreateEntity(OUTPUT, 1580, 205);
CreateEntity(OUTPUT, 1570, 265);
// c
CreateEntity(OUTPUT, 1550, 375);
CreateEntity(OUTPUT, 1540, 435);
// d
CreateEntity(OUTPUT, 1360, 490);
CreateEntity(OUTPUT, 1430, 490);
CreateEntity(OUTPUT, 1500, 490);
// e
CreateEntity(OUTPUT, 1320, 375);
CreateEntity(OUTPUT, 1310, 435);
// f
CreateEntity(OUTPUT, 1350, 205);
CreateEntity(OUTPUT, 1340, 265);
// g
CreateEntity(OUTPUT, 1380, 315);
CreateEntity(OUTPUT, 1450, 315);
CreateEntity(OUTPUT, 1520, 315);

CreateEntity(INPUT_HIGH, 200, 195);
CreateEntity(INPUT_CLK, 200, 275);
CreateEntity(AND, 450, 520)
CreateEntity(AND, 450, 670)
CreateEntity(JKFF, 700, 200);
CreateEntity(JKFF, 700, 350);
CreateEntity(JKFF, 700, 500);
CreateEntity(JKFF, 700, 650);

CreateWire(0, 1, 0, 0);
CreateWire(0, 2, 0, 0);
CreateWire(0, 3, 0, 0);
CreateWire(0, 4, 1, 0);
CreateWire(0, 5, 1, 0);
CreateWire(0, 6, 2, 0);
CreateWire(0, 7, 2, 0);
CreateWire(0, 8, 3, 0);
CreateWire(0, 9, 3, 0);
CreateWire(0, 10, 3, 0);
CreateWire(0, 11, 4, 0);
CreateWire(0, 12, 4, 0);
CreateWire(0, 13, 5, 0);
CreateWire(0, 14, 5, 0);
CreateWire(0, 15, 6, 0);
CreateWire(0, 16, 6, 0);
CreateWire(0, 17, 6, 0);

CreateWire(18, 22, 0, 0);
CreateWire(18, 22, 0, 2);
CreateWire(19, 22, 0, 1);
CreateWire(19, 23, 0, 1);
CreateWire(19, 24, 0, 1);
CreateWire(19, 25, 0, 1);
CreateWire(22, 23, 0, 0);
CreateWire(22, 23, 0, 2);
CreateWire(22, 20, 0, 0);
CreateWire(23, 20, 0, 1);
CreateWire(20, 24, 0, 0);
CreateWire(20, 24, 0, 2);
CreateWire(20, 21, 0, 0);
CreateWire(24, 21, 0, 1);
CreateWire(21, 25, 0, 0);
CreateWire(21, 25, 0, 2);
CreateWire(22, 0, 0, 0)
CreateWire(23, 0, 0, 1)
CreateWire(24, 0, 0, 2)
CreateWire(25, 0, 0, 3)