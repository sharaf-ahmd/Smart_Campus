package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.TicketStatus;

@Converter
public class TicketStatusConverter extends CaseInsensitiveEnumConverter<TicketStatus> {
    public TicketStatusConverter() { super(TicketStatus.class); }
}
