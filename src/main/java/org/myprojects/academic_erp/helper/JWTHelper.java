package org.myprojects.academic_erp.helper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JWTHelper {
    private final String SECRET_KEY = "some random text secret vghvh vhgvhghv";
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 12;   // 12 Hr

    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateToken(String email, String userType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_type", userType);
        return createToken(claims, email);
    }

    // ======================================================

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractUserType(String token) {
        return extractClaims(token).get("user_type").toString();
    }

    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    // ======================================================

    public Boolean validateToken(String token) {
        return !extractExpiration(token).before(new Date());
    }

    public Boolean validateAuthorizationHeader(String authorizationHeader, List<String> allowedUserTypes) {
        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authorizationHeader.substring(7);
        String email = extractEmail(token);
        String userType = extractUserType(token);

        return email != null && userType != null && allowedUserTypes.contains(userType) && validateToken(token);
    }

}
