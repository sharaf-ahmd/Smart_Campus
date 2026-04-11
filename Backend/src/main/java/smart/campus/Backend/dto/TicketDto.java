package smart.campus.Backend.dto;

import lombok.Data;
import smart.campus.Backend.entity.enums.TicketCategory;
import smart.campus.Backend.entity.enums.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class TicketDto {
    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Description is required")
    private String description;
}
