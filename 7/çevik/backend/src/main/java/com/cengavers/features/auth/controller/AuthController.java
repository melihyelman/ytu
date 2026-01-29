package com.cengavers.features.auth.controller;


import com.cengavers.features.auth.dto.request.signInRequest;
import com.cengavers.features.auth.dto.request.signUpRequest;
import com.cengavers.features.auth.dto.signInDTO;
import com.cengavers.features.auth.dto.signUpDTO;
import com.cengavers.features.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Duration;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Value("${security.jwt.cookie-name:AUTH}")
    private String cookieName;

    @Value("${security.jwt.cookie-secure:false}")
    private boolean cookieSecure;

    @PostMapping("/sign-up")
    public ResponseEntity<signUpDTO> signUp(@RequestBody signUpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(request));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<signInDTO> signIn(@RequestBody signInRequest request, HttpServletResponse resp) {
        signInDTO signInDTO = authService.signIn(request);
        ResponseCookie cookie= ResponseCookie.from(cookieName, signInDTO.getToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofMillis(signInDTO.getExpiresIn()))
                .sameSite("None")
                .build();
        resp.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());
        return ResponseEntity.ok(signInDTO);
    }

    @PostMapping("/sign-out")
    public ResponseEntity<Void> signOut(HttpServletResponse res) {
        ResponseCookie cleared = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
        res.addHeader(HttpHeaders.SET_COOKIE, cleared.toString());
        return ResponseEntity.ok().build();
    }





}
