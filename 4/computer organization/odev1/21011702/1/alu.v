module alu(
    input [31:0]a,
    input [31:0]b,
    input [2:0] alucontrol,
    output [31:0]result
);
    wire overflow, overflowXnor,overflowXor,notAlucontrol1,cout,beforeZeroExtent;
    wire [31:0] sum,xorAB,andAB,notB,sumInput,temp,zeroExtent;

    xnor overflowXnorFunc(overflowXnor,alucontrol[0],b[31],a[31]);
    xor overflowXorFunc(overflowXor,a[31],sum[31]);
    not notAlucontrol1Func(notAlucontrol1,alucontrol[1]);
    and overflowFunc(overflow,overflowXnor,overflowXor,notAlucontrol1);

    and_32bit andABFunc(andAB,a,b);
    xor_32bit xorABFUNC(xorAB,a,b);
    not_32bit notBFunc(notB,b);

    mux_2x1_32bit sumMux(sumInput,b,notB,alucontrol[0]);
    full_adder_32bit sumFunc(a,sumInput,alucontrol[0],sum,cout);

    xor beforeZeroExtentFunc(beforeZeroExtent,sum[31],overflow);

    zero_extender_32bit zeroExtendFunc(beforeZeroExtent,zeroExtent);

    assign temp = 32'h00000000;

    mux_8x1_32bit mux_8x1(result,sum,sum,andAB,xorAB,temp,zeroExtent,temp,temp,alucontrol);

endmodule

module full_adder(
    input a,
    input b,
    input cin,
    output sum,
    output cout
);
wire XOR1,AND1,AND2;
xor x1(XOR1,a,b);
and a1(AND1,a,b);
and a2(AND2,cin,XOR1);

xor x2(sum,XOR1,cin);
or o1(cout,AND1,AND2);
endmodule


module full_adder_4bit(
    input [3:0] a,
    input [3:0] b,
    input cin,
    output [3:0] sum,
    output cout
);

wire [3:0] carry;

full_adder fa0(a[0], b[0], cin, sum[0], carry[0]);
full_adder fa1(a[1], b[1], carry[0], sum[1], carry[1]);
full_adder fa2(a[2], b[2], carry[1], sum[2], carry[2]);
full_adder fa3(a[3], b[3], carry[2], sum[3], cout);

endmodule



module full_adder_32bit(
    input [31:0] a,
    input [31:0] b,
    input cin,
    output [31:0] sum,
    output cout
);

wire [7:0] cout_internal;

full_adder_4bit fa0(.a(a[3:0]), .b(b[3:0]), .cin(cin), .sum(sum[3:0]), .cout(cout_internal[0]));
full_adder_4bit fa1(.a(a[7:4]), .b(b[7:4]), .cin(cout_internal[0]), .sum(sum[7:4]), .cout(cout_internal[1]));
full_adder_4bit fa2(.a(a[11:8]), .b(b[11:8]), .cin(cout_internal[1]), .sum(sum[11:8]), .cout(cout_internal[2]));
full_adder_4bit fa3(.a(a[15:12]), .b(b[15:12]), .cin(cout_internal[2]), .sum(sum[15:12]), .cout(cout_internal[3]));
full_adder_4bit fa4(.a(a[19:16]), .b(b[19:16]), .cin(cout_internal[3]), .sum(sum[19:16]), .cout(cout_internal[4]));
full_adder_4bit fa5(.a(a[23:20]), .b(b[23:20]), .cin(cout_internal[4]), .sum(sum[23:20]), .cout(cout_internal[5]));
full_adder_4bit fa6(.a(a[27:24]), .b(b[27:24]), .cin(cout_internal[5]), .sum(sum[27:24]), .cout(cout_internal[6]));
full_adder_4bit fa7(.a(a[31:28]), .b(b[31:28]), .cin(cout_internal[6]), .sum(sum[31:28]), .cout(cout_internal[7]));

assign cout = cout_internal[7];

endmodule

module mux_2x1_1bit(out, a, b, select);
    input a, b, select;
    wire and_1, and_2, select_not;
    output out;
    not (select_not, select);
    and (and_1, a, select_not);
    and (and_2, b, select);
    or (out, and_1, and_2);
endmodule

module mux_2x1_4bit(out, a, b, select);
    input [3:0] a, b;
    input select;
    output [3:0] out;

    mux_2x1_1bit mux1(out[0],a[0],b[0],select);
    mux_2x1_1bit mux2(out[1],a[1],b[1],select);
    mux_2x1_1bit mux3(out[2],a[2],b[2],select);
    mux_2x1_1bit mux4(out[3],a[3],b[3],select);
endmodule

module mux_2x1_32bit(out, a, b, select);
    input [31:0] a, b;
    input select;
    output [31:0] out;

    mux_2x1_4bit mux1(out[3:0],a[3:0],b[3:0],select);
    mux_2x1_4bit mux2(out[7:4],a[7:4],b[7:4],select);
    mux_2x1_4bit mux3(out[11:8],a[11:8],b[11:8],select);
    mux_2x1_4bit mux4(out[15:12],a[15:12],b[15:12],select);
    mux_2x1_4bit mux5(out[19:16],a[19:16],b[19:16],select);
    mux_2x1_4bit mux6(out[23:20],a[23:20],b[23:20],select);
    mux_2x1_4bit mux7(out[27:24],a[27:24],b[27:24],select);
    mux_2x1_4bit mux8(out[31:28],a[31:28],b[31:28],select);
endmodule

module mux_4x1_32bit(out, a, b, c, d,select);
    input [31:0] a, b,c,d;
    input [1:0]select;
    output [31:0] out;
    wire [31:0]mux1,mux2;

    mux_2x1_32bit mux1Result(mux1,a,b,select[0]);
    mux_2x1_32bit mux2Result(mux2,c,d,select[0]);

    mux_2x1_32bit result(out,mux1,mux2,select[1]);
endmodule

module mux_8x1_32bit(out, a, b, c, d,e,f,g,h,select);
    input [31:0] a, b,c,d,e,f,g,h;
    input [2:0]select;
    output [31:0] out;
    wire [31:0]mux1,mux2;

    mux_4x1_32bit mux1Result(mux1,a,b,c,d,select[1:0]);
    mux_4x1_32bit mux2Result(mux2,e,f,g,h,select[1:0]);

    mux_2x1_32bit result(out,mux1,mux2,select[2]);
endmodule

module zero_extender_32bit (
    input input_bit,
    output wire [31:0] output_data
);

assign output_data = { {31{1'b0}}, input_bit };

endmodule

module and_4bit(result,a,b);
    input [3:0] a,b;
    output [3:0] result;

    and a1(result[0],a[0],b[0]);
    and a2(result[1],a[1],b[1]);
    and a3(result[2],a[2],b[2]);
    and a4(result[3],a[3],b[3]);
endmodule

module and_32bit(result,a,b);
    input [31:0]a,b;
    output [31:0] result;

    and_4bit a1(result[3:0],a[3:0],b[3:0]);
    and_4bit a2(result[7:4],a[7:4],b[7:4]);
    and_4bit a3(result[11:8],a[11:8],b[11:8]);
    and_4bit a4(result[15:12],a[15:12],b[15:12]);
    and_4bit a5(result[19:16],a[19:16],b[19:16]);
    and_4bit a6(result[23:20],a[23:20],b[23:20]);
    and_4bit a7(result[27:24],a[27:24],b[27:24]);
    and_4bit a8(result[31:28],a[31:28],b[31:28]);
endmodule

module xor_4bit(result,a,b);
    input [3:0] a,b;
    output [3:0] result;

    xor a1(result[0],a[0],b[0]);
    xor a2(result[1],a[1],b[1]);
    xor a3(result[2],a[2],b[2]);
    xor a4(result[3],a[3],b[3]);
endmodule

module xor_32bit(result,a,b);
    input [31:0]a,b;
    output [31:0] result;

    xor_4bit a1(result[3:0],a[3:0],b[3:0]);
    xor_4bit a2(result[7:4],a[7:4],b[7:4]);
    xor_4bit a3(result[11:8],a[11:8],b[11:8]);
    xor_4bit a4(result[15:12],a[15:12],b[15:12]);
    xor_4bit a5(result[19:16],a[19:16],b[19:16]);
    xor_4bit a6(result[23:20],a[23:20],b[23:20]);
    xor_4bit a7(result[27:24],a[27:24],b[27:24]);
    xor_4bit a8(result[31:28],a[31:28],b[31:28]);
endmodule

module not_4bit(result,a);
    input [3:0] a;
    output [3:0] result;

    not a1(result[0],a[0]);
    not a2(result[1],a[1]);
    not a3(result[2],a[2]);
    not a4(result[3],a[3]);
endmodule

module not_32bit(result,a);
    input [31:0]a;
    output [31:0] result;

    not_4bit a1(result[3:0],a[3:0]);
    not_4bit a2(result[7:4],a[7:4]);
    not_4bit a3(result[11:8],a[11:8]);
    not_4bit a4(result[15:12],a[15:12]);
    not_4bit a5(result[19:16],a[19:16]);
    not_4bit a6(result[23:20],a[23:20]);
    not_4bit a7(result[27:24],a[27:24]);
    not_4bit a8(result[31:28],a[31:28]);
endmodule
