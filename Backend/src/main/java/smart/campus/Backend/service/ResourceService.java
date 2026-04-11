package smart.campus.Backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.campus.Backend.dto.ResourceDto;
import smart.campus.Backend.entity.Resource;
import smart.campus.Backend.exception.ResourceNotFoundException;
import smart.campus.Backend.repository.ResourceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    public Resource createResource(ResourceDto dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .status(dto.getStatus())
                .build();
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, ResourceDto dto) {
        Resource existing = getResourceById(id);
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setCapacity(dto.getCapacity());
        existing.setLocation(dto.getLocation());
        existing.setStatus(dto.getStatus());
        return resourceRepository.save(existing);
    }

    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}
