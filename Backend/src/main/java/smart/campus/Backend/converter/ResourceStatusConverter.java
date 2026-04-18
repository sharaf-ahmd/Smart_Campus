package smart.campus.Backend.converter;

import jakarta.persistence.Converter;
import smart.campus.Backend.entity.enums.ResourceStatus;

@Converter
public class ResourceStatusConverter extends CaseInsensitiveEnumConverter<ResourceStatus> {
    public ResourceStatusConverter() { super(ResourceStatus.class); }
}
