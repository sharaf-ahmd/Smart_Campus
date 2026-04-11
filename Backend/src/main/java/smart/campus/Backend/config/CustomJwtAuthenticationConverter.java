package smart.campus.Backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import smart.campus.Backend.entity.User;
import smart.campus.Backend.entity.enums.Role;
import smart.campus.Backend.repository.UserRepository;

import java.util.Collection;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        String subject = jwt.getSubject();

        // If email is null, just use subject as identifier to avoid NullPointerException
        if (email == null) {
            email = subject;
        }

        final String finalEmail = email;
        
        // Find or create user
        User user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            User newUser = User.builder()
                    .email(finalEmail)
                    .name(name != null ? name : "Unknown User")
                    .oauthProviderId(subject)
                    .role(Role.USER) // Default role
                    .build();
            return userRepository.save(newUser);
        });

        Collection<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return new JwtAuthenticationToken(jwt, authorities, finalEmail); // principle is the email
    }
}
