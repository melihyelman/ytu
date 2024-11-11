SSEG    SEGMENT PARA STACK 'STACK'
    DW 32 DUP (?)
SSEG    ENDS

DSEG    SEGMENT PARA 'DATA'

SAYILAR DW 10 DUP(0)      ; Maksimum 10 elemanlık dizi
MOD_DEGERI DW ?           ; MOD değeri tutulacak
CR      EQU 13
LF      EQU 10
MSG1    DB 'Dizi eleman sayisini giriniz (max 10): ',0
MSG2    DB 'Eleman giriniz: ',0
SONUC   DB CR, LF, 'MOD: ', 0
MSG_HATA_SAYI    DB CR, LF, 'Dikkat!!! Eleman sayisi 1 ile 10 arasinda olmali. Yeniden giriniz.', 0
HATA    DB CR, LF, 'Dikkat sayi giriniz!!! Yeniden giriniz.', 0
MSG_HATA_ARALIK  DB CR, LF, 'Dikkat!!! Girilen eleman izin verilen aralikta degil. Yeniden giriniz.', 0

DSEG    ENDS

CSEG    SEGMENT PARA 'CODE'
    ASSUME CS:CSEG, DS:DSEG, SS:SSEG

GIRIS_DIZI MACRO LEN
    LOCAL GIRIS_LOOP, GIR_ELEMAN, HATA_ELEMAN_ARALIK, GIRIS_DIZI_END

    PUSH SI
    PUSH CX
    PUSH AX

    MOV CX, LEN            ; Dizinin uzunluğu
    MOV SI, 0              ; Dizinin başlangıcı

GIRIS_LOOP:
    MOV AX, OFFSET MSG2
    CALL PUT_STR

GIR_ELEMAN:
    CALL GETN
    CMP AX, 1
    JL HATA_ELEMAN_ARALIK
    CMP AX, 100
    JG HATA_ELEMAN_ARALIK

    MOV SAYILAR[SI], AX    ; Girdi elemanını diziye kaydet
    ADD SI, 2
    LOOP GIRIS_LOOP
    JMP GIRIS_DIZI_END

HATA_ELEMAN_ARALIK:
    MOV AX, OFFSET MSG_HATA_ARALIK
    CALL PUT_STR
    JMP GIR_ELEMAN

GIRIS_DIZI_END:
    POP AX
    POP CX
    POP SI
ENDM

MOD_AL PROC NEAR
    PUSH CX
    PUSH BP
    MOV BP, SP

    MOV CX, [BP+4]         ; BP+4, çağrı sırasında yığına itilmiş parametreye işaret eder
    XOR SI, SI              
    XOR DI, DI              ; Maksimum tekrar sayısı
    XOR DX, DX              ; Mod değeri
    XOR BX, BX             

MOD_OUTER_LOOP:
    MOV AX, SAYILAR[SI]    
    XOR BX, BX              ; Mevcut elemanın tekrar sayısı
    XOR DI, DI              
    MOV BX, CX             

MOD_INNER_LOOP:
    MOV DX, SAYILAR[DI]
    CMP AX, DX
    JNE MOD_NEXT
    INC BX                 ; tekrar arttır
MOD_NEXT:
    ADD DI, 2
    DEC BX
    JNZ MOD_INNER_LOOP

    ;tekrar sayısı karşılaştırma
    CMP BX, DI
    JBE SKIP_UPDATE
    MOV DI, BX             ; tekrar sayısı
    MOV DX, AX             ; mod değeri güncelle

SKIP_UPDATE:
    ADD SI, 2 
    DEC CX
    JNZ MOD_OUTER_LOOP

    MOV [BP + 6], DX

    POP BP
    POP CX
    RET 
MOD_AL ENDP

ANA PROC FAR
    PUSH DS
    XOR AX,AX
    PUSH AX
    MOV AX, DSEG
    MOV DS, AX

GIR_ELEMAN_SAYISI:
    MOV AX, OFFSET MSG1
    CALL PUT_STR
    CALL GETN
    MOV CX, AX             ; CX = Dizinin uzunluğu (1 <= uzunluk <= 10)

    CMP CX, 1
    JL HATA_ELEMAN_SAYISI
    CMP CX, 10
    JG HATA_ELEMAN_SAYISI

    GIRIS_DIZI CX

    PUSH CX
    CALL MOD_AL
    POP MOD_DEGERI

    MOV AX, OFFSET SONUC
    CALL PUT_STR
    MOV AX, MOD_DEGERI
    CALL PUTN

    RETF

HATA_ELEMAN_SAYISI:
    MOV AX, OFFSET MSG_HATA_SAYI
    CALL PUT_STR
    JMP GIR_ELEMAN_SAYISI
ANA ENDP

GETC	PROC NEAR
        ;------------------------------------------------------------------------
        ; Klavyeden basılan karakteri AL yazmacına alır ve ekranda gösterir. 
        ; işlem sonucunda sadece AL etkilenir. 
        ;------------------------------------------------------------------------
        MOV AH, 1h
        INT 21H
        RET 
GETC	ENDP 

PUTC	PROC NEAR
        ;------------------------------------------------------------------------
        ; AL yazmacındaki değeri ekranda gösterir. DL ve AH değişiyor. AX ve DX 
        ; yazmaçlarının değerleri korumak için PUSH/POP yapılır. 
        ;------------------------------------------------------------------------
        PUSH AX
        PUSH DX
        MOV DL, AL
        MOV AH,2
        INT 21H
        POP DX
        POP AX
        RET 
PUTC 	ENDP 

GETN 	PROC NEAR
        ;------------------------------------------------------------------------
        ; Klavyeden basılan sayiyi okur, sonucu AX yazmacı üzerinden dondurur. 
        ; DX: sayının işaretli olup/olmadığını belirler. 1 (+), -1 (-) demek 
        ; BL: hane bilgisini tutar 
        ; CX: okunan sayının islenmesi sırasındaki ara değeri tutar. 
        ; AL: klavyeden okunan karakteri tutar (ASCII)
        ; AX zaten dönüş değeri olarak değişmek durumundadır. Ancak diğer 
        ; yazmaçların önceki değerleri korunmalıdır. 
        ;------------------------------------------------------------------------
        PUSH BX
        PUSH CX
        PUSH DX
GETN_START:
        MOV DX, 1	                        ; sayının şimdilik + olduğunu varsayalım 
        XOR BX, BX 	                        ; okuma yapmadı Hane 0 olur. 
        XOR CX,CX	                        ; ara toplam değeri de 0’dır. 
NEW:
        CALL GETC	                        ; klavyeden ilk değeri AL’ye oku. 
        CMP AL,CR 
        JE FIN_READ	                        ; Enter tuşuna basilmiş ise okuma biter
        CMP  AL, '-'	                        ; AL ,'-' mi geldi ? 
        JNE  CTRL_NUM	                        ; gelen 0-9 arasında bir sayı mı?
NEGATIVE:
        MOV DX, -1	                        ; - basıldı ise sayı negatif, DX=-1 olur
        JMP NEW		                        ; yeni haneyi al
CTRL_NUM:
        CMP AL, '0'	                        ; sayının 0-9 arasında olduğunu kontrol et.
        JB error 
        CMP AL, '9'
        JA error		                ; değil ise HATA mesajı verilecek
        SUB AL,'0'	                        ; rakam alındı, haneyi toplama dâhil et 
        MOV BL, AL	                        ; BL’ye okunan haneyi koy 
        MOV AX, 10 	                        ; Haneyi eklerken *10 yapılacak 
        PUSH DX		                        ; MUL komutu DX’i bozar işaret için saklanmalı
        MUL CX		                        ; DX:AX = AX * CX
        POP DX		                        ; işareti geri al 
        MOV CX, AX	                        ; CX deki ara değer *10 yapıldı 
        ADD CX, BX 	                        ; okunan haneyi ara değere ekle 
        JMP NEW 		                ; klavyeden yeni basılan değeri al 
ERROR:
        MOV AX, OFFSET HATA 
        CALL PUT_STR	                        ; HATA mesajını göster 
        JMP GETN_START                          ; o ana kadar okunanları unut yeniden sayı almaya başla 
FIN_READ:
        MOV AX, CX	                        ; sonuç AX üzerinden dönecek 
        CMP DX, 1	                        ; İşarete göre sayıyı ayarlamak lazım 
        JE FIN_GETN
        NEG AX		                        ; AX = -AX
FIN_GETN:
        POP DX
        POP CX
        POP DX
        RET 
GETN 	ENDP 

PUTN 	PROC NEAR
        ;------------------------------------------------------------------------
        ; AX de bulunan sayiyi onluk tabanda hane hane yazdırır. 
        ; CX: haneleri 10’a bölerek bulacağız, CX=10 olacak
        ; DX: 32 bölmede işleme dâhil olacak. Soncu etkilemesin diye 0 olmalı 
        ;------------------------------------------------------------------------
        PUSH CX
        PUSH DX 	
        XOR DX,	DX 	                        ; DX 32 bit bölmede soncu etkilemesin diye 0 olmalı 
        PUSH DX		                        ; haneleri ASCII karakter olarak yığında saklayacağız.
                                                ; Kaç haneyi alacağımızı bilmediğimiz için yığına 0 
                                                ; değeri koyup onu alana kadar devam edelim.
        MOV CX, 10	                        ; CX = 10
        CMP AX, 0
        JGE CALC_DIGITS	
        NEG AX 		                        ; sayı negatif ise AX pozitif yapılır. 
        PUSH AX		                        ; AX sakla 
        MOV AL, '-'	                        ; işareti ekrana yazdır. 
        CALL PUTC
        POP AX		                        ; AX’i geri al 
        
CALC_DIGITS:
        DIV CX  		                ; DX:AX = AX/CX  AX = bölüm DX = kalan 
        ADD DX, '0'	                        ; kalan değerini ASCII olarak bul 
        PUSH DX		                        ; yığına sakla 
        XOR DX,DX	                        ; DX = 0
        CMP AX, 0	                        ; bölen 0 kaldı ise sayının işlenmesi bitti demek
        JNE CALC_DIGITS	                        ; işlemi tekrarla 
        
DISP_LOOP:
                                                ; yazılacak tüm haneler yığında. En anlamlı hane üstte 
                                                ; en az anlamlı hane en alta ve onu altında da 
                                                ; sona vardığımızı anlamak için konan 0 değeri var. 
        POP AX		                        ; sırayla değerleri yığından alalım
        CMP AX, 0 	                        ; AX=0 olursa sona geldik demek 
        JE END_DISP_LOOP 
        CALL PUTC 	                        ; AL deki ASCII değeri yaz
        JMP DISP_LOOP                           ; işleme devam
        
END_DISP_LOOP:
        POP DX 
        POP CX
        RET
PUTN 	ENDP 

PUT_STR	PROC NEAR
        ;------------------------------------------------------------------------
        ; AX de adresi verilen sonunda 0 olan dizgeyi karakter karakter yazdırır.
        ; BX dizgeye indis olarak kullanılır. Önceki değeri saklanmalıdır. 
        ;------------------------------------------------------------------------
	PUSH BX 
        MOV BX,	AX			        ; Adresi BX’e al 
        MOV AL, BYTE PTR [BX]	                ; AL’de ilk karakter var 
PUT_LOOP:   
        CMP AL,0		
        JE  PUT_FIN 			        ; 0 geldi ise dizge sona erdi demek
        CALL PUTC 			        ; AL’deki karakteri ekrana yazar
        INC BX 				        ; bir sonraki karaktere geç
        MOV AL, BYTE PTR [BX]
        JMP PUT_LOOP			        ; yazdırmaya devam 
PUT_FIN:
	POP BX
	RET 
PUT_STR	ENDP

CSEG    ENDS
    END ANA