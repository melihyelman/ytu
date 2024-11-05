CODESEG    SEGMENT PARA 'code'
            ORG 100h
            ASSUME DS:CODESEG, CS:CODESEG, SS:CODESEG

START:      JMP MAIN

primeOddSum             DB 15 DUP(?)
nonPrimeOrEvenSum       DB 15 DUP(?)
indexPrimeOddSum        DW 0
indexNonPrimeOrEvenSum  DW 0
cSquare                 DW ?

MAIN PROC NEAR
    MOV CX, 1      ; CX = a
    loopA:
        CMP CX, 51     ; a > 50 ise çık
        JAE endProgram

        MOV BX, CX     ; BX = b
        loopB:
            CMP BX, 51     ; b > 50 ise çık
            JAE nextA

            MOV AX, CX     ; AX = a
            MUL AX         ; DX:AX = a^2
            MOV SI, AX     ; SI = a^2

            MOV AX, BX     ; AX = b
            MUL AX         ; AX = b^2
            ADD AX, SI     ; AX = a^2 + b^2
            MOV cSquare, AX

            CALL Sqrt      ; c'yi hesapla
            CMP AX, 0
            JE nextB      ; Tam sayı c yoksa sonraki b'ye geç

            CMP AX, 51     ; c > 50 ?
            JAE nextB

            CALL isPrime
            CMP DX, 0
            MOV DX, AX     ; DX = c
            MOV DL, AL     ; DL = c'nin düşük baytı
            JZ jumpNonPrimeOrEvenSum   ; Asal değilse 

            MOV AX, CX     ; AX = a
            ADD AX, BX     ; AX = a + b
            AND AX, 1
            JZ jumpNonPrimeOrEvenSum   ; a + b çift sayıysa

            ; primeOddSum dizisine eklemeden önce kontrol et
            MOV SI, indexPrimeOddSum
            XOR DI, DI
            checkPrimeOddSumArray:
                CMP DI, SI
                JAE addToPrimeOddSum     ; Dizinin sonuna geldiysek ekle
                MOV AL, primeOddSum[DI]
                CMP AL, DL
                JE nextB                ; Zaten dizide varsa ekleme
                INC DI
                JMP checkPrimeOddSumArray

            addToPrimeOddSum:
                MOV primeOddSum[SI], DL
                INC indexPrimeOddSum
                JMP nextB

            jumpNonPrimeOrEvenSum:
                ; nonPrimeOrEvenSum dizisine eklemeden önce kontrol et
                MOV SI, indexNonPrimeOrEvenSum
                XOR DI, DI
                checkNonPrimeOrEvenSumArray:
                    CMP DI, SI
                    JAE addToNonPrimeOrEvenSum     ; Dizinin sonuna geldiysek ekle
                    MOV AL, nonPrimeOrEvenSum[DI]
                    CMP AL, DL
                    JE nextB                      ; Zaten dizide varsa ekleme
                    INC DI
                    JMP checkNonPrimeOrEvenSumArray

                addToNonPrimeOrEvenSum:
                    MOV nonPrimeOrEvenSum[SI], DL
                    INC indexNonPrimeOrEvenSum
                    JMP nextB

        nextB:
            INC BX
            JMP loopB

    nextA:
        INC CX
        JMP loopA

endProgram:
    RET
MAIN ENDP


;SQRT(AX)
Sqrt PROC NEAR
            PUSH BX
            MOV BX, 1
    sqrt_loop:
            MOV AX, BX
            MUL BX         ; DX:AX = BX^2
            CMP AX, cSquare
            JE sqrt_found
            JA sqrt_not_found
            INC BX
            JMP sqrt_loop

    sqrt_found:
            MOV AX, BX     ; Karekökte tam sayı bulundu
            POP BX
            RET

    sqrt_not_found:
            MOV AX, 0      ; Tam sayı karekök yok
            POP BX
            RET
Sqrt ENDP


; ?ISPRIME(AX)
isPrime PROC NEAR
            PUSH AX
            PUSH BX
            PUSH CX

            MOV BX, AX         ; BX = Sayı
            CMP BX, 2
            JB not_prime       ; 2'den küçükse asal değil

            MOV CX, 2
    prime_loop:
            MOV AX, BX
            MOV DX, 0
            DIV CX

            CMP DX, 0
            JE not_prime

            INC CX      
            CMP CX, BX          ; c < b ?
            JL prime_loop

    end_isPrime:
            MOV DX, 1          ; Asal

    done_isPrime:
            POP CX
            POP BX
            POP AX
            RET
    not_prime:
            MOV DX, 0          ; Asal değil
            JMP done_isPrime


isPrime ENDP

CODESEG    ENDS
            END START
