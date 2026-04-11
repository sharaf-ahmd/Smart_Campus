package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.TicketPriority;

@Converter
public class TicketPriorityConverter extends CaseInsensitiveEnumConverter<TicketPriority> {
    public TicketPriorityConverter() { super(TicketPriority.class); }
}
