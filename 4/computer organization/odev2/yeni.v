module ALU (input signed[31:0]srcA, srcB, input[2:0] ALUControl,output reg[31:0] ALUResult,output zero);
    assign zero = ~|ALUResult;
    always @(srcA, srcB,ALUControl) begin
        case (ALUControl)
            3'b000:  ALUResult = srcA + srcB;
            3'b001:  ALUResult = srcA - srcB;
            3'b010:  ALUResult = srcA & srcB;
            3'b011:  ALUResult = srcA | srcB;
	    3'b100:  ALUResult = srcA ^ srcB;
            3'b101:  ALUResult = srcA < srcB ? 1 : 0;
            default: ALUResult = {32{1'b0}};
        endcase
    end
endmodule

module Adder(input [31:0] a,b,output [31:0] out );
	assign out=a+b;
endmodule

`define 	R_Type	7'b0110011
`define 	I_Type	7'b0010011
`define		Lw	7'b0000011
`define 	Jalr	7'b1100111
`define		S_Type	7'b0100011
`define		J_Type	7'b1101111
`define 	B_Type	7'b1100011
`define		U_Type	7'b0110111


`define		Add	10'b0000_0000_00
`define 	Sub	10'b0100_0000_00
`define		And	10'b0000_0001_11
`define 	Or	10'b0000_0001_10
`define		Slt	10'b0000_0000_10


`define		lw	3'b010
`define 	addi	3'b000
`define		xori	3'b100
`define 	ori	3'b110
`define		slti	3'b010
`define		jalr	3'b000


`define		beq	3'b000
`define 	bne	3'b001
`define		blt	3'b100
`define 	bge	3'b101



module Controller(input zero,branchLEG,input[2:0] func3,input[6:0] func7,op,output reg MemWrite,ALUSrc,RegWrite,output reg [1:0] pcSrc,ResultSrc,output reg [2:0] ALUControl,ImmSrc);
	wire[9:0] func;
	assign func={func7,func3};
	always@(func3,func7,op) begin
		{MemWrite,ALUSrc,RegWrite,pcSrc,ResultSrc,ALUControl,ImmSrc}=13'b0000_0000_0000_0;
		case(op)
			`R_Type:begin
				RegWrite=1'b1;
				case(func)
					`Add:;
					`Sub:ALUControl=3'b001;
					`And:ALUControl=3'b010;
					`Or :ALUControl=3'b011;
					`Slt:ALUControl=3'b101;
				endcase
				end
			`Lw:begin	
					ALUSrc = 1'b1;
					ResultSrc=1'b1;
					RegWrite=1'b1;
			end
			`I_Type:begin
				ALUSrc=1'b1;
				case(func3)					
					`addi:;
					`xori:ALUControl=3'b100;
					`ori :ALUControl=3'b011;
					`slti:ALUControl=3'b101;
				endcase
				RegWrite=1'b1;
				end
			`Jalr:begin 
				pcSrc=2'b10;
				ALUSrc=1'b1;
				ResultSrc=2'b10;
				RegWrite=1'b1;

			end
			`S_Type:begin
					ResultSrc=2'bxx;
					ImmSrc=3'b001;
					ALUSrc=1'b1;
					MemWrite=1'b1;
				end
			`J_Type:begin
					pcSrc=2'b01;
					ResultSrc=2'b10;
					ALUControl=3'bxxx;
					ALUSrc=1'bx;
					ImmSrc=3'b010;
					RegWrite=1'b1;
				end
			`B_Type:begin 
					ResultSrc=2'bxx;
					ImmSrc=3'b011;
				case(func3)
					`beq:begin
						ALUControl=3'b001;
						pcSrc= zero ? 01 : 00;
					end
					`bne:begin
						ALUControl=3'b001;
						pcSrc= zero ? 00 : 01;
					end
					`blt:begin
						ALUControl=3'b101;
						pcSrc= branchLEG ? 01 : 00;
					end
					`bge:begin
						ALUControl=3'b101;
						pcSrc= branchLEG ? 00 : 01;
					end
				endcase
				end
			`U_Type:begin
					ResultSrc=2'b11;
					ALUControl=3'bxxx;
					ALUSrc=1'bx;
					ImmSrc=3'b100;
					RegWrite=1'b1;
				end
			default:;
		endcase
	end
endmodule

module DataMem(input clk , we,input[31:0] A,WD,output[31:0] ReadData);
	reg [31:0] mem [0:16383];
	initial $readmemh("DataMemory.txt", mem);
	wire [31:0] adr;
	assign adr = {2'b00,A[31:2]}; 
	assign ReadData=mem[adr];
	always@(posedge clk)begin 
		if(we)
			mem[adr]<=WD;
		else
			mem[adr]<=mem[adr];
	end
endmodule

module DataPath(input clk,MemWrite,ALUSrc,RegWrite,input [1:0] pcSrc,ResultSrc,input [2:0] ALUControl,ImmSrc,output zero,branchLEG,output[2:0] func3,output[6:0] func7,op);
	wire [31:0] PCPlus4,PCTarget,ALUResult,PCNext,PC,Instr,ImmExt,Result,RD1,RD2,SrcB,ReadData;
	Mux3to1		M31(pcSrc,PCPlus4,PCTarget,ALUResult,PCNext);
	Register	PCReg(clk,PCNext,PC);
	InstMemory	InstructionMemory(PC,Instr); 
	Adder		PC4Adder(PC,4,PCPlus4);/// 4 OK?
	ImmExtend	Extend(ImmSrc,Instr[31:7] ,ImmExt);
	RegisterFile	RegisterFile(clk,RegWrite,Instr[19:15],Instr[24:20],Instr[11:7],Result,RD1,RD2);
	Mux2to1		M21(ALUSrc,RD2,ImmExt,SrcB);
	ALU 		ALU(RD1, SrcB,ALUControl,ALUResult,zero);
	Adder		PCImmAdder(PC,ImmExt,PCTarget);
    	DataMem		DataMemory(clk ,MemWrite,ALUResult,RD2,ReadData);
	Mux4to1		M41(ResultSrc,ALUResult,ReadData,PCPlus4,ImmExt,Result);
	assign	brachLEG=	ALUResult[0];
	assign 	func3	=	Instr[14:12];
	assign	func7	=	Instr[31:25];
	assign  op   	=	Instr[6:0];

endmodule

`define 	I_Type	3'b000			
`define 	S_Type	3'b001
`define 	J_Type	3'b010
`define 	B_Type	3'b011
`define 	U_Type	3'b100

module ImmExtend(input[2:0] immSrc,input[31:7] imm,output reg[31:0] extend);
	always @(immSrc,imm) begin 
		case(immSrc)
			`I_Type:extend={{20{imm[31]}},imm[31:20]};
			`S_Type:extend={{20{imm[31]}},imm[31:25],imm[11:7]};
			`J_Type:extend={{12{imm[31]}},imm[31],imm[19:12],imm[20],imm[30:21],1'b0};
			`B_Type:extend={{19{imm[31]}},imm[31],imm[7],imm[30:25],imm[11:8],1'b0};
		 	`U_Type:extend={imm[31:12],{12{1'b0}}};
			default: extend = {32{1'b0}};
		endcase
	end
endmodule

module InstMemory (input[31:0] A,output[31:0] RD); 

    reg [31:0] instMem [0:16383];

    wire [31:0] adr;
    assign adr = {2'b00,A[31:2]}; 

    initial $readmemh("inst_memory.txt", instMem);
    assign RD=instMem[adr];
endmodule

module Mux2to1(input select,input [31:0] a,b,output[31:0] out);
	assign out= (select==0) ? a : b ;
endmodule

module Mux3to1(input [1:0] select,input[31:0] a,b,c,output[31:0] out);
	assign out= (select==2'b00) ? a:
		    (select==2'b01) ? b:
		    (select==2'b10) ? c:
			{32{1'b0}};
endmodule

module Mux4to1(input [1:0] select,input[31:0] a,b,c,d,output[31:0] out);
	assign out= (select==2'b00) ? a:
		    (select==2'b01) ? b:
		    (select==2'b10) ? c:
		    (select==2'b11) ? d:
			{32{1'b0}};
endmodule

module Register(clk,in,out);
	input clk;
	input[31:0] in;
	output reg[31:0] out=32'b0;
	always@(posedge clk)
		out=in;
endmodule

module RegisterFile(input clk,we,input [4:0] A1,A2,A3,input[31:0] WD3,output[31:0] RD1,RD2);
	reg[31:0] mem [0:31];
	initial begin
		mem[0]=32'b0;
	end
	assign RD1=mem[A1];
	assign RD2=mem[A2];
	always@(posedge clk)begin 
		if(we==1&&A3!=32'b0)
			mem[A3]<=WD3;
		else
			mem[A3]<=mem[A3];
	end
endmodule			
module TestSingleCycle();
	reg clk=0;
	RiscvSingleCyle	RVSC(clk);
	always #20 clk=~clk;
    initial begin
        $dumpfile("yenitest.vcd");
        $dumpvars(0,TestSingleCycle);
    end    
	initial begin 
	#5000
	$stop;
	end
endmodule

module RiscvSingleCyle(input clk);
	wire		MemWrite,ALUSrc,RegWrite,zero,branchLEG;
	wire[1:0]	pcSrc,ResultSrc;
	wire[2:0]	ALUControl,ImmSrc,func3;
	wire[6:0]	func7,op;
	DataPath	DP(clk,MemWrite,ALUSrc,RegWrite,pcSrc,ResultSrc,ALUControl,ImmSrc,zero,branchLEG,func3,func7,op);
	Controller	CTRL(zero,branchLEG,func3,func7,op,MemWrite,ALUSrc,RegWrite,pcSrc,ResultSrc,ALUControl,ImmSrc);
endmodule