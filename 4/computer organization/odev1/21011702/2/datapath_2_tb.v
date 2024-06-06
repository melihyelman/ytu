`include "datapath.v"
module datapath_2_tb();

    reg [2:0] alucontrol;
    reg [1:0] addr1, addr2, addr3;
    reg clk, rst, wr;
    wire [31:0] result,data1,data2;

    always #5 clk = ~clk;

    datapath uut(
        .alucontrol(alucontrol),
        .data1(data1),
        .data2(data2),
        .result(result),
        .addr1(addr1),
        .addr2(addr2),
        .addr3(addr3),
        .clk(clk),
        .rst(rst),
        .wr(wr)
    );

    initial begin
        $dumpfile("datapath_2_tb.vcd");
        $dumpvars(0, datapath_2_tb);
        rst = 0;
        clk = 0;
        #10 
        
        wr = 0;
        // R1 = 0
        addr1 = 2'b00;
        addr2 = 2'b00;
        addr3 = 2'b01;
        alucontrol = 3'b001;
        #10;
        wr = 1;
        #10;

        wr = 0;
        // R0 = -1, R0 = R1 - R3
        addr1 = 2'b01;
        addr2 = 2'b11;
        addr3 = 2'b00;
        alucontrol = 3'b001;
        #10;
        wr = 1;
        #10;

        wr = 0;
        // R2 = R1 - 1(R0) = -1
        addr1 = 2'b01;
        addr2 = 2'b00;
        addr3 = 2'b10;
        alucontrol = 3'b000;
        #10;
        wr = 1;
        #10;

        wr = 0;
        // R3 = R0 + 1 = 0
        addr1 = 2'b00;
        addr2 = 2'b00;
        addr3 = 2'b11;
        alucontrol = 3'b001;
        #10;
        wr = 1;
        #10;
        $finish;
    end

endmodule
