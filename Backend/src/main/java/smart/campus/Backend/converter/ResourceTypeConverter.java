package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.ResourceType;

@Converter
public class ResourceTypeConverter extends CaseInsensitiveEnumConverter<ResourceType> {
    public ResourceTypeConverter() { super(ResourceType.class); }
}
