package com.example.payroll.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
            	    // Public
            	    .requestMatchers("/api/v1/auth/**").permitAll()
            	    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

            	    //Employee self-service 
            	    .requestMatchers("/api/v1/employees/me/**").hasAnyRole("EMPLOYEE", "ADMIN")
            	 // Payroll
            	    .requestMatchers("/api/v1/payroll/my/**").hasAnyRole("EMPLOYEE","ADMIN")
            	   

            	    // Admin-only
            	    .requestMatchers("/api/v1/employees/**").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/departments/**").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/jobs/**").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/payroll/**").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/reports/**").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/users/**").hasRole("ADMIN")

            	    // Leave
            	    .requestMatchers("/api/v1/leaves/employee/**").hasAnyRole("EMPLOYEE","ADMIN")
            	    .requestMatchers("/api/v1/leaves/pending").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/leaves/*/approve").hasRole("ADMIN")
            	    .requestMatchers("/api/v1/leaves/*/reject").hasRole("ADMIN")

            	    // All others
            	    .anyRequest().authenticated()
            	)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}