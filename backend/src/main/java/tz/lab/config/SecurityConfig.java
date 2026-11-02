
package tz.lab.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // Password encryption
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Application users and their roles
    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder encoder,

            @Value("${app.users.manager.password}") String manager,
            @Value("${app.users.reception.password}") String reception,
            @Value("${app.users.technician.password}") String technician,
            @Value("${app.users.cashier.password}") String cashier) {

        return new InMemoryUserDetailsManager(

            // Manager account
            User.withUsername("manager@gmail.com")
                .password(encoder.encode(manager))
                .roles("MANAGER")
                .build(),

            // Receptionist account
            User.withUsername("reception@gmail.com")
                .password(encoder.encode(reception))
                .roles("RECEPTIONIST")
                .build(),

            // Laboratory technician account
            User.withUsername("technician@gmail.com")
                .password(encoder.encode(technician))
                .roles("LAB_TECHNICIAN")
                .build(),

            // Cashier account
            User.withUsername("cashier@gmail.com")
                .password(encoder.encode(cashier))
                .roles("CASHIER")
                .build()
        );
    }

    // Spring Security configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        return http

            // Disable CSRF for this API
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(Customizer.withDefaults())

            // API permissions
            .authorizeHttpRequests(auth -> auth

                // Allow browser CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Dashboard permissions
                .requestMatchers("/api/dashboard/**")
                    .hasAnyRole("MANAGER", "CASHIER")

                // Patient registration and updates
                .requestMatchers(HttpMethod.POST, "/api/patients/**")
                    .hasAnyRole("MANAGER", "RECEPTIONIST")

                .requestMatchers(HttpMethod.PUT, "/api/patients/**")
                    .hasAnyRole("MANAGER", "RECEPTIONIST")

                // Patient access
                .requestMatchers("/api/patients/**")
                    .hasAnyRole(
                        "MANAGER",
                        "RECEPTIONIST",
                        "LAB_TECHNICIAN",
                        "CASHIER"
                    )

                // Create laboratory orders
                .requestMatchers(HttpMethod.POST, "/api/orders/**")
                    .hasAnyRole("MANAGER", "RECEPTIONIST")

                // Enter test results and update test status
                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/orders/*/result",
                    "/api/orders/*/status"
                )
                    .hasAnyRole("MANAGER", "LAB_TECHNICIAN")

                // Process payments
                .requestMatchers(HttpMethod.PATCH, "/api/orders/*/payment")
                    .hasAnyRole("MANAGER", "CASHIER")

                // General laboratory order access
                .requestMatchers("/api/orders/**")
                    .hasAnyRole(
                        "MANAGER",
                        "RECEPTIONIST",
                        "LAB_TECHNICIAN",
                        "CASHIER"
                    )

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            // HTTP Basic authentication
            .httpBasic(Customizer.withDefaults())

            .build();
    }

    // CORS configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Allow React frontend ports
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ));

        // Allowed HTTP methods
        config.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ));

        // Allowed request headers
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With"
        ));

        // Allow HTTP Basic authentication credentials
        config.setAllowCredentials(true);

        // Cache preflight response for one hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
