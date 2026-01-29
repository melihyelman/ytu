package com.cengavers.features.auth.service;


import com.cengavers.features.auth.dto.request.signInRequest;
import com.cengavers.features.auth.dto.request.signUpRequest;
import com.cengavers.features.auth.dto.signInDTO;
import com.cengavers.features.auth.dto.signUpDTO;

public interface AuthService {
    signUpDTO signUp(signUpRequest request);
    signInDTO signIn(signInRequest request);
}
