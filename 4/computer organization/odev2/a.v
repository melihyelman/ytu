
module top(
	input  clk, reset,
    output [31:0] WriteData, DataAdr,
    output MemWrite);
 wire [31:0] PC, Instr, ReadData;
 // instantiate processor and memories
 riscvsingle rvsingle(clk, reset, PC, Instr, MemWrite, 
    DataAdr, WriteData, ReadData);
 imem imem(PC, Instr);
 dmem dmem(clk, MemWrite, DataAdr, WriteData, ReadData);
endmodule


module riscvsingle(
	input  clk, reset,
    output  [31:0] PC,
    input  [31:0] Instr,
    output  MemWrite,
    output [31:0] ALUResult, WriteData,
    input  [31:0] ReadData);

 wire ALUSrc, RegWrite, FRegWrite,Jump, Zero;
 wire [1:0] ResultSrc, ImmSrc;
 wire [2:0] ALUControl;


controller c(Instr[6:0], Instr[14:12], Instr[30], Zero,
ResultSrc, MemWrite, PCSrc,
ALUSrc, RegWrite,FRegWrite, Jump,
ImmSrc, ALUControl);

datapath dp(clk, reset, ResultSrc, PCSrc,
ALUSrc, RegWrite,
ImmSrc, ALUControl,
Zero, PC, Instr,
ALUResult, WriteData, ReadData);
endmodule


module datapath(
  input clk, reset,
  input [1:0] ResultSrc,
  input PCSrc, ALUSrc,
  input RegWrite,
  input [1:0] ImmSrc,
  input [2:0] ALUControl,
  output Zero,
  output [31:0] PC,
  input [31:0] Instr,
  output [31:0] ALUResult, WriteData,
  input [31:0] ReadData
);

  wire [31:0] PCNext, PCPlus4, PCTarget;
  wire [31:0] ImmExt;
  wire [31:0] SrcA, SrcB, SrcAF, SrcBF ;
  wire [31:0] Result;

  // Next PC logic
  flopr #(32) pcreg(clk, reset, PCNext, PC);
  adder pcadd4(PC, 32'd4, PCPlus4);
  adder pcaddbranch(PC, ImmExt, PCTarget);
  mux2 #(32) pcmux(PCPlus4, PCTarget, PCSrc, PCNext);


  // register file logic
  regfile rf(clk,reset, RegWrite, Instr[19:15], Instr[24:20],
  Instr[11:7], Result, SrcA, WriteData);
  extend ext(Instr[31:7], ImmSrc, ImmExt);

  // ALU logic
  mux2 #(32) srcbmux(WriteData, ImmExt, ALUSrc, SrcB);
  alu alu(SrcA, SrcB, ALUControl, ALUResult, Zero);
  mux3 #(32) resultmux(ALUResult, ReadData, PCPlus4,
   ResultSrc, Result);
endmodule


module controller(
	  input [6:0] op,
      input [2:0] funct3,
      input funct7b5,
      input Zero,
      output [1:0] ResultSrc,
      output MemWrite,
      output PCSrc, ALUSrc,
      output RegWrite, FRegWrite, Jump,
      output [1:0] ImmSrc,
      output [2:0] ALUControl);
wire [1:0] ALUOp;
wire Branch;
maindec md(op, ResultSrc, MemWrite, Branch,
 ALUSrc, RegWrite, Jump, ImmSrc, ALUOp, FRegWrite);
aludec ad(op[5], funct3, funct7b5, ALUOp, ALUControl);
assign PCSrc = Branch & Zero | Jump;
endmodule


module dmem(
	input clk, we,
    input [31:0] a, wd,
    output [31:0] rd);
 reg [31:0] RAM[63:0];
 assign rd = RAM[a[31:2]]; // word aligned
 always @(posedge clk) begin
 	if (we)
 	 RAM[a[31:2]] <= wd;
 end
 
endmodule


module aludec(
	    input  opb5,
      input [2:0] funct3,
      input  funct7b5,
      input  [1:0] ALUOp,
      output reg [2:0] ALUControl);

 wire RtypeSub;
 assign RtypeSub = funct7b5 & opb5; // TRUE for R–type subtract
 always@(*) begin
 	case(ALUOp)
         2'b00: ALUControl = 3'b000; // addition
         2'b01: ALUControl = 3'b001; // subtraction
         default: case(funct3) // R–type or I–type ALU
                       3'b000: if (RtypeSub)
                                 ALUControl = 3'b001; // sub
                               else 
                                 ALUControl = 3'b000; // add, addi
                       3'b010: ALUControl = 3'b101; // slt, slti
                       3'b110: ALUControl = 3'b011; // or, ori
                       3'b111: ALUControl = 3'b010; // and, andi
                       default: ALUControl = 3'bxxx; // ???
                   endcase
    endcase
 end
 
endmodule
module extend(
	input [31:7] instr,
    input [1:0] immsrc,
    output reg [31:0] immext);


 always@(*) begin
 	case(immsrc)
         // I−type
         2'b00: immext = {{20{instr[31]}}, instr[31:20]};
         // S−type (stores)
         2'b01: immext = {{20{instr[31]}}, instr[31:25], 
          instr[11:7]};
         // B−type (branches)
         2'b10: immext = {{20{instr[31]}}, instr[7], 
          instr[30:25], instr[11:8], 1'b0}; 
         // J−type (jal)
         2'b11: immext = {{12{instr[31]}}, instr[19:12], 
          instr[20], instr[30:21], 1'b0};
         default: immext = 32'bx; // undefined
    endcase
 end
endmodule
module imem(
	input [31:0] a,
    output [31:0] rd);

 reg [31:0] RAM[63:0];

initial begin
  



     RAM[0] = 32'h00500293;
     RAM[1] = 32'h00000333;
     RAM[2] = 32'h00130313;
     RAM[3] = 32'hfe630ee3;
end

 assign rd = RAM[a[31:2]]; // word aligned
endmodule
module maindec(
	  input  [6:0] op,
      output  [1:0] ResultSrc,
      output  MemWrite,
      output  Branch, ALUSrc,
      output  RegWrite, Jump,
      output [1:0] ImmSrc,
      output [1:0] ALUOp,
      output FRegWrite);

 reg [10:0] controls;
 assign {RegWrite, ImmSrc, ALUSrc, MemWrite,
 ResultSrc, Branch, ALUOp, Jump, FRegWrite} = controls;
 always@(*) begin
 	case(op)
 // RegWrite_ImmSrc_ALUSrc_MemWrite_ResultSrc_Branch_ALUOp_Jump
 7'b0000011: controls = 12'b1_00_1_0_01_0_00_0_0; // lw
 7'b0100011: controls = 12'b0_01_1_1_00_0_00_0_0; // sw
 7'b0110011: controls = 12'b1_xx_0_0_00_0_10_0_0; // R–type
 7'b1100011: controls = 12'b0_10_0_0_00_1_01_0_0; // beq
 7'b0010011: controls = 12'b1_00_1_0_00_0_10_0_0; // I–type ALU
 7'b1101111: controls = 12'b1_11_0_0_10_0_00_1_0; // jal
 default: controls = 12'bx_xx_x_x_xx_x_xx_x_x; // ??? 
 endcase
 end
endmodule

module regfile(
    input  clk, reset,
    input  we3,
    input  [4:0] a1, a2, a3,
    input  [31:0] wd3,
    output reg[31:0] rd1, rd2);

    reg [31:0] rf[31:0];

    integer i;
    initial begin
        for (i = 0; i < 32; i = i + 1) begin
            rf[i] = 0;
        end
    end
    always @(posedge clk) begin
        if (we3) 
            rf[a3] <= wd3; 
    end

    always @* begin
        rd1 = (a1 != 0) ? rf[a1] : 0;
        rd2 = (a2 != 0) ? rf[a2] : 0;
    end

endmodule


module flopenr #(parameter WIDTH = 8) (
  input  clk, reset, en,
  input  [WIDTH-1:0] d,
  output reg [WIDTH-1:0] q
);

  always @(posedge clk, posedge reset) begin
    if (reset)
      q <= 0;
    else if (en)
      q <= d;
  end

endmodule

module flopr #(parameter WIDTH = 8)
(input  clk, reset,
 input  [WIDTH-1:0] d,
 output reg [WIDTH-1:0] q);

 always @(posedge clk or posedge reset) begin
    if (reset)
        q <= 0;
    else
        q <= d;
 end

endmodule
module alu( input [31:0] operand1, input [31:0] operand2, input [2:0] opcode, output [31:0] result, output zero);

  reg [31:0] temp;

  always @(*)
    case (opcode)
      3'b000: temp = operand1 + operand2; // Addition
      3'b001: temp = operand1 - operand2; // Subtraction
      3'b010: temp = operand1 & operand2; // Bitwise OR
      3'b011: temp = operand1 | operand2; // Bitwise AND
      3'b101: temp = (operand1 < operand2) ? 32'b0001 : 32'b0000; // Set Less Than (SLT)
      default: temp = 32'bxxxxx; // Invalid opcode
    endcase

  assign result = temp;
  assign zero = (temp == 32'b0) ? 1'b1 : 1'b0;

endmodule
module adder(input [31:0] a, b,
 output [31:0] y);
 assign y = a + b;
endmodule
module mux2 #(parameter WIDTH = 8) (
  input  [WIDTH-1:0] d0, d1,
  input  s,
  output [WIDTH-1:0] y
);

  assign y = (s) ? d1 : d0;

endmodule
module mux3 #(parameter WIDTH = 8) (
  input  [WIDTH-1:0] d0, d1, d2,
  input  [1:0] s,
  output [WIDTH-1:0] y
);

  assign  y = s[1] ? d2 : (s[0] ? d1 : d0);

endmodule