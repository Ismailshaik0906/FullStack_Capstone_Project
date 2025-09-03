package com.example.payroll.service;

import com.example.payroll.config.JwtUtil;
import com.example.payroll.entity.Role;
import com.example.payroll.entity.User;
import com.example.payroll.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setUserId(1L);
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setPassword("password");
        user.setRole(Role.EMPLOYEE);
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encodedPass");
        when(userRepository.save(user)).thenReturn(user);

        // Act
        User saved = authService.register(user);

        // Assert
        assertNotNull(saved);
        verify(passwordEncoder).encode("password");
        verify(userRepository).save(user);
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(user));

        assertEquals("User already exists with email: john@example.com", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        String email = "john@example.com";
        String password = "password";
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
        when(auth.isAuthenticated()).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(email)).thenReturn("jwt-token");

        // Act
        Map<String, Object> response = authService.login(email, password);

        // Assert
        assertNotNull(response.get("accessToken"));
        assertEquals("Bearer", response.get("tokenType"));
        assertEquals("jwt-token", response.get("accessToken"));
        assertEquals("john", ((Map<?, ?>) response.get("user")).get("username"));
    }
}