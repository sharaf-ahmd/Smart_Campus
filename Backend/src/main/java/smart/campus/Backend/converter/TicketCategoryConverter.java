package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.TicketCategory;

@Converter
public class TicketCategoryConverter extends CaseInsensitiveEnumConverter<TicketCategory> {
    public TicketCategoryConverter() { super(TicketCategory.class); }
}
