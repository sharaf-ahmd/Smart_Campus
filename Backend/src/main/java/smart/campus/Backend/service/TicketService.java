package smart.campus.Backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import smart.campus.Backend.dto.TicketDto;
import smart.campus.Backend.entity.Attachment;
import smart.campus.Backend.entity.Resource;
import smart.campus.Backend.entity.Ticket;
import smart.campus.Backend.entity.User;
import smart.campus.Backend.entity.enums.TicketStatus;
import smart.campus.Backend.exception.ResourceNotFoundException;
import smart.campus.Backend.repository.AttachmentRepository;
import smart.campus.Backend.repository.ResourceRepository;
import smart.campus.Backend.repository.TicketRepository;
import smart.campus.Backend.repository.UserRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepository        ticketRepository;
    private final ResourceRepository      resourceRepository;
    private final UserRepository          userRepository;
    private final AttachmentRepository    attachmentRepository;
    private final FileStorageService      fileStorageService;
    private final NotificationService     notificationService;
    private final EmailService            emailService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllWithRelations();
    }

    public List<Ticket> getTicketsByReporter(Long reporterId) {
        return ticketRepository.findByReporterId(reporterId);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    @Transactional
    public Ticket createTicket(Long reporterId, TicketDto dto) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + reporterId));

        Ticket ticket = Ticket.builder()
                .resource(resource)
                .reporter(reporter)
                .category(dto.getCategory())
                .priority(dto.getPriority())
                .status(TicketStatus.OPEN)
                .description(dto.getDescription())
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // In-app notification → all admins
        notificationService.notifyAllAdmins(
            String.format("🎫 New %s-priority ticket #%d reported by %s on \"%s\": %s",
                dto.getPriority(), saved.getId(), reporter.getName(), resource.getName(),
                dto.getDescription().length() > 60
                    ? dto.getDescription().substring(0, 60) + "…"
                    : dto.getDescription()));

        // Email → reporter confirming submission
        emailService.sendTicketReceived(
            reporter.getEmail(), reporter.getName(),
            saved.getId(), resource.getName(),
            dto.getCategory().name(), dto.getPriority().name(),
            dto.getDescription());

        return saved;
    }

    @Transactional
    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(newStatus);
        Ticket saved = ticketRepository.save(ticket);

        Long   reporterId    = saved.getReporter().getId();
        String reporterEmail = saved.getReporter().getEmail();
        String reporterName  = saved.getReporter().getName();
        String resourceName  = saved.getResource().getName();

        switch (newStatus) {
            case IN_PROGRESS -> {
                notificationService.createNotification(reporterId,
                    String.format("🔧 Your ticket #%d for \"%s\" is now being worked on.", ticketId, resourceName));
                emailService.sendTicketInProgress(reporterEmail, reporterName, ticketId, resourceName);
            }
            case RESOLVED -> {
                notificationService.createNotification(reporterId,
                    String.format("✅ Your ticket #%d for \"%s\" has been resolved!", ticketId, resourceName));
                emailService.sendTicketResolved(reporterEmail, reporterName, ticketId, resourceName);
            }
            case CLOSED -> {
                notificationService.createNotification(reporterId,
                    String.format("🔒 Your ticket #%d for \"%s\" has been closed.", ticketId, resourceName));
                emailService.sendTicketClosed(reporterEmail, reporterName, ticketId, resourceName);
            }
            case REJECTED -> {
                notificationService.createNotification(reporterId,
                    String.format("❌ Your ticket #%d for \"%s\" has been rejected.", ticketId, resourceName));
                emailService.sendTicketRejected(reporterEmail, reporterName, ticketId, resourceName);
            }
            default -> {}
        }

        return saved;
    }

    @Transactional
    public Ticket assignTicket(Long ticketId, Long assigneeId) {
        Ticket ticket = getTicketById(ticketId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assigneeId));
        ticket.setAssignee(assignee);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        Ticket saved = ticketRepository.save(ticket);

        Long   reporterId    = saved.getReporter().getId();
        String reporterEmail = saved.getReporter().getEmail();
        String reporterName  = saved.getReporter().getName();
        String resourceName  = saved.getResource().getName();

        // In-app notification
        notificationService.createNotification(reporterId,
            String.format("🔧 Your ticket #%d has been assigned to %s and is now in progress.",
                ticketId, assignee.getName()));

        // Email
        emailService.sendTicketAssigned(reporterEmail, reporterName,
            ticketId, resourceName, assignee.getName());

        return saved;
    }

    @Transactional
    public void deleteTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        Long   reporterId    = ticket.getReporter().getId();
        String reporterEmail = ticket.getReporter().getEmail();
        String reporterName  = ticket.getReporter().getName();
        String resourceName  = ticket.getResource().getName();

        ticketRepository.delete(ticket);

        // In-app notification
        notificationService.createNotification(reporterId,
            String.format("🗑️ Your ticket #%d for \"%s\" has been removed by an administrator.",
                ticketId, resourceName));

        // Email
        emailService.sendTicketDeleted(reporterEmail, reporterName, ticketId, resourceName);
    }

    @Transactional
    public List<Attachment> addAttachments(Long ticketId, List<MultipartFile> files) {
        Ticket ticket = getTicketById(ticketId);
        List<Attachment> saved = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                String url = fileStorageService.store(file);
                saved.add(attachmentRepository.save(
                    Attachment.builder().ticket(ticket).fileUrl(url).build()));
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
            }
        }
        return saved;
    }

    public List<Attachment> getAttachments(Long ticketId) {
        return attachmentRepository.findByTicketId(ticketId);
    }
}
