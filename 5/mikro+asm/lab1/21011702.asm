STSG SEGMENT PARA STACK 'STSGM'
    DW 20 DUP(?)
STSG ENDS

DTSG SEGMENT PARA 'DTSGM'
    midterms DW 77, 85, 64, 96
    finals DW 56, 63, 86, 74
    obp DW 4 DUP(?) 
DTSG ENDS

CDSG SEGMENT PARA 'CDSGM'
    ASSUME CS:CDSG, DS:DTSG, SS:STSG

    MAIN PROC FAR

        PUSH DS
        XOR AX, AX
        PUSH AX

        MOV AX, DTSG
        MOV DS, AX

        MOV CX, 4                           
        XOR SI, SI                         

    CALC_OBP_LOOP:
        MOV AX, midterms[SI]                

        MOV BX, 4
        MUL BX                            

        MOV BX, AX                   

        MOV AX, finals[SI]              

        MOV DX, 6          
        MUL DX       

        ADD AX, BX; ax = midterms[i] * 4 + finals[i] * 6                       

        MOV BX, 5
        ADD AX, BX; ax = midterms[i] * 4 + finals[i] * 6 + 5         

        MOV BX, 10 
        DIV BX; ax = (midterms[i] * 4 + finals[i] * 6 + 5) / 10                

        MOV obp[SI], AX            
        ADD SI, 2                           
        LOOP CALC_OBP_LOOP     

    SORT:
        MOV CX, 3

    FIRST_LOOP:
        MOV SI, 0            
        MOV DX, 3

    SECOND_LOOP:
        MOV AX, obp[SI]                
        MOV BX, obp[SI+2]              
        CMP AX, BX                          
        JAE NOT_SWAP            
        MOV obp[SI], BX               
        MOV obp[SI+2], AX          

    NOT_SWAP:
        ADD SI, 2                          
        DEC DX                              
        JNZ SECOND_LOOP         
        DEC CX
        JNZ FIRST_LOOP          

        RETF

    MAIN ENDP

CDSG ENDS
    END MAIN
