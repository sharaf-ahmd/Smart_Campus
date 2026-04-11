package smart.campus.Backend.converter;

import jakarta.persistence.AttributeConverter;

/**
 * Base converter that reads enum values from the DB case-insensitively.
 * Handles Hibernate 7's quirk of occasionally passing the enum object itself
 * through convertToEntityAttribute instead of a raw String.
 */
public abstract class CaseInsensitiveEnumConverter<E extends Enum<E>>
        implements AttributeConverter<E, String> {

    private final Class<E> enumClass;

    protected CaseInsensitiveEnumConverter(Class<E> enumClass) {
        this.enumClass = enumClass;
    }

    @Override
    public String convertToDatabaseColumn(E attribute) {
        return attribute == null ? null : attribute.name(); // always write UPPER_CASE
    }

    @Override
    @SuppressWarnings("unchecked")
    public E convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty())
            return null;

        // Hibernate 7 occasionally passes the already-resolved enum toString()
        // which equals name() for standard enums — handle gracefully either way
        for (E constant : enumClass.getEnumConstants()) {
            if (constant.name().equalsIgnoreCase(dbData.trim())) {
                return constant;
            }
        }

        // Last-resort: try to match by ordinal string (e.g. "0", "1")
        try {
            int ordinal = Integer.parseInt(dbData.trim());
            E[] constants = enumClass.getEnumConstants();
            if (ordinal >= 0 && ordinal < constants.length) {
                return constants[ordinal];
            }
        } catch (NumberFormatException ignored) {
        }

        throw new IllegalArgumentException(
                "Cannot convert DB value \"" + dbData + "\" to enum " + enumClass.getSimpleName()
                        + ". Valid values: " + java.util.Arrays.toString(enumClass.getEnumConstants()));
    }
}
