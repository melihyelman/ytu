`include "alu.v"
module alu_tb;
    reg [31:0] a;
    reg [31:0] b;
    reg [2:0] alucontrol;
    
    wire [31:0] result;
    alu uut (
        .a(a),
        .b(b),
        .alucontrol(alucontrol),
        .result(result)
    );
    initial begin
        $dumpfile("alu_tb.vcd");
        $dumpvars(0, alu_tb);
    
        a=32'h00000000; b=32'h00000000; alucontrol=3'b000; #5;
        a=32'h10000001; b=32'hFFFFFFFF; alucontrol=3'b000; #5;
        a=32'h000A0010; b=32'h0C000011; alucontrol=3'b000; #5;
        a=32'h1100E000; b=32'h1100F001; alucontrol=3'b000; #5;
        a=32'h11011000; b=32'h01110000; alucontrol=3'b000; #5;
        a=32'h11111111; b=32'h11111111; alucontrol=3'b000; #10;

        a=32'h00000000; b=32'h00000000; alucontrol=3'b001; #5;
        a=32'h00000001; b=32'h000000F0; alucontrol=3'b001; #5;
        a=32'h11000000; b=32'h1100000E; alucontrol=3'b001; #5;
        a=32'h11F11000; b=32'h01110D00; alucontrol=3'b001; #5;
        a=32'h11111111; b=32'h11111111; alucontrol=3'b001; #10;

        a=32'h00000000; b=32'h00000000; alucontrol=3'b010; #5;
        a=32'h01001001; b=32'h01001010; alucontrol=3'b010; #5;
        a=32'h11000000; b=32'h11000001; alucontrol=3'b010; #5;
        a=32'h11011F00; b=32'h011100E0; alucontrol=3'b010; #5;
        a=32'h00000000; b=32'hFFFFFFFF; alucontrol=3'b010; #5;
        a=32'h11111111; b=32'h11111111; alucontrol=3'b010; #10;

        a=32'h00000000; b=32'h00000000; alucontrol=3'b011; #5;
        a=32'h00D00E01; b=32'h00F0A010; alucontrol=3'b011; #5;
        a=32'h00000010; b=32'h00000011; alucontrol=3'b011; #5;
        a=32'h11011000; b=32'h01110000; alucontrol=3'b011; #5;
        a=32'h00000000; b=32'hFFFFFFFF; alucontrol=3'b011; #5;
        a=32'h11111111; b=32'h11111111; alucontrol=3'b011; #10;

        a=32'h00000000; b=32'h00000000; alucontrol=3'b101; #5;
        a=32'h0000000F; b=32'h0000000A; alucontrol=3'b101; #5;
        a=32'h0000000A; b=32'h0000000F; alucontrol=3'b101; #5;
        a=32'h0000000A; b=32'hFFFFFFFF; alucontrol=3'b101; #5;
        a=32'h11111111; b=32'h11111111; alucontrol=3'b101; #10;

        $finish;
    end
endmodule