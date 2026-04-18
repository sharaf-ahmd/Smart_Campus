package smart.campus.Backend.dto;

import lombok.Data;
import smart.campus.Backend.entity.enums.ResourceStatus;
import smart.campus.Backend.entity.enums.ResourceType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ResourceDto {
    @NotBlank(message = "Resource name is required")
    private String name;
    
    @NotNull(message = "Resource type is required")
    private ResourceType type;
    
    private Integer capacity;
    private String location;
    
    @NotNull(message = "Resource status is required")
    private ResourceStatus status;
}
