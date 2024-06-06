`timescale 1ns / 1ps
`include "single.v"

module TestBench;
    reg clk = 0;
    reg reset = 1;

    wire [31:0] pc;
    wire [31:0] alu_result;
    wire [31:0] write_data;
    wire [31:0] read_data = 32'b0;

    RiscV_SingleCycle uut(
        .clk(clk),
        .reset(reset),
        .pc(pc),
        .alu_result(alu_result),
        .write_data(write_data),
        .read_data(read_data)
    );

    always #10 clk = !clk;

    initial begin
        $dumpfile("processor_sim.vcd");
        $dumpvars(0, TestBench);

        // Assert reset
        reset = 1;
        #20; // Hold reset for 20ns
        reset = 0;

        // Initialize registers
        uut.registers[0] = 0;  // R0 = 0
        uut.instruction_memory[0] = 32'h00000093; // addi x1, zero, 0
        uut.instruction_memory[1] = 32'h01400113; // addi x2, zero, 20
        uut.instruction_memory[2] = 32'h02800193; // addi x3, zero, 40
        uut.instruction_memory[3] = 32'h01400213; // addi x4, zero, 20
        //loop:
        uut.instruction_memory[4] = 32'h02020263; // beq x4, x4, 8
        uut.instruction_memory[5] = 32'h0000a283; // lw x5, 0(x1)
        uut.instruction_memory[6] = 32'h00012303; // lw x6, 0(x2)
        uut.instruction_memory[7] = 32'h003303b3; // add x7, x6, x3
        uut.instruction_memory[8] = 32'h0053a023; // sw x5, 0(x7)
        uut.instruction_memory[9] = 32'h00108093; // addi x1, zero, 1
        uut.instruction_memory[10] = 32'h00110113; // addi x2, zero, 1
        uut.instruction_memory[11] = 32'hfff20213; // addi x4, x4, -1
        uut.instruction_memory[12] = 32'hfe1ff06f; // jal x0, -32
        //end:
        uut.instruction_memory[13] = 32'h00a00893; // addi x17, zero, 10
        uut.instruction_memory[14] = 32'h00000073; // ecall

        #4800;
        for (integer i = 40; i < 60; i++) begin
            $display("Memory[%d]: %d", i, uut.memory[i]);
        end
        $finish;
    end
endmodule
