package com.g6.acrobatteAPI.security;

import java.sql.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenUtil {

    private final UserRepository userRepository;
    private byte[] jwtSecret;

    public JwtTokenUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
        jwtSecret = Base64.getDecoder().decode("ztqrL32f9Wo900klg7erC5Jw49et0vge8pUQy7LvCSw=");
    }

    public String generateAccessToken(User user) {
        String jwt = Jwts.builder().setSubject("g6").setAudience("Acrobatte API").claim("email", user.getEmail())
                .setIssuedAt(Date.from(Instant.now())).signWith(SignatureAlgorithm.HS256, Keys.hmacShaKeyFor(jwtSecret))
                .setExpiration(Date.from(Instant.now().plus(30, ChronoUnit.MINUTES))).compact();

        return jwt;
    }

    public boolean validate(String token) {
        try {
            Jws<Claims> result = Jwts.parser().requireAudience("Acrobatte API")
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret)).parseClaimsJws(token);

            String email = (String) result.getBody().get("email");
            userRepository.findByEmail(email).get();
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public String getEmail(String token) {
        String email = null;
        Jws<Claims> result = Jwts.parser().requireAudience("Acrobatte API").setSigningKey(Keys.hmacShaKeyFor(jwtSecret))
                .parseClaimsJws(token);

        email = (String) result.getBody().get("email");
        return email;
    }

}
