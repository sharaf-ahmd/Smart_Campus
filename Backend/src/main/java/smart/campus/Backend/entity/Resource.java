package smart.campus.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import smart.campus.Backend.converter.ResourceStatusConverter;
import smart.campus.Backend.converter.ResourceTypeConverter;
import smart.campus.Backend.entity.enums.ResourceStatus;
import smart.campus.Backend.entity.enums.ResourceType;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Convert(converter = ResourceTypeConverter.class)
    @Column(nullable = false)
    private ResourceType type;

    private Integer capacity;

    private String location;

    @Convert(converter = ResourceStatusConverter.class)
    @Column(nullable = false)
    private ResourceStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
