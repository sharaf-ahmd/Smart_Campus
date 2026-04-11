package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.BookingStatus;

@Converter
public class BookingStatusConverter extends CaseInsensitiveEnumConverter<BookingStatus> {
    public BookingStatusConverter() { super(BookingStatus.class); }
}
