package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.Role;

@Converter
public class RoleConverter extends CaseInsensitiveEnumConverter<Role> {
    public RoleConverter() { super(Role.class); }
}
