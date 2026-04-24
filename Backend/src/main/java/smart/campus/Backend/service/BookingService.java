package smart.campus.Backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smart.campus.Backend.dto.BookingDto;
import smart.campus.Backend.entity.Booking;
import smart.campus.Backend.entity.Resource;
import smart.campus.Backend.entity.User;
import smart.campus.Backend.entity.enums.BookingStatus;
import smart.campus.Backend.exception.ConflictException;
import smart.campus.Backend.exception.ResourceNotFoundException;
import smart.campus.Backend.repository.BookingRepository;
import smart.campus.Backend.repository.ResourceRepository;
import smart.campus.Backend.repository.UserRepository;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository       bookingRepository;
    private final ResourceRepository      resourceRepository;
    private final UserRepository          userRepository;
    private final NotificationService     notificationService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllWithRelations();
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    @Transactional
    public Booking createBooking(Long userId, BookingDto dto) {
        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resource.getId(), dto.getStartTime(), dto.getEndTime(), activeStatuses);

        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource is already booked during this time period.");
        }

        Booking booking = Booking.builder()
                .resource(resource)
                .user(user)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(BookingStatus.PENDING)
                .purpose(dto.getPurpose())
                .build();

        Booking saved = bookingRepository.save(booking);

        // In-app notification → all admins
        notificationService.notifyAllAdmins(
            String.format("📅 New booking request from %s for \"%s\" (Booking #%d). Awaiting approval.",
                user.getName(), resource.getName(), saved.getId()));

        return saved;
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(newStatus);
        Booking saved = bookingRepository.save(booking);

        BookingStatus oldStatus = booking.getStatus();
        Long ownerId = saved.getUser().getId();
        String resourceName = saved.getResource().getName();

        switch (newStatus) {
            case APPROVED -> notificationService.createNotification(ownerId,
                String.format("✅ Your booking for \"%s\" (Booking #%d) has been approved!", resourceName, bookingId));
            case REJECTED -> notificationService.createNotification(ownerId,
                String.format("❌ Your booking for \"%s\" (Booking #%d) has been rejected.", resourceName, bookingId));
            case CANCELLED -> notificationService.createNotification(ownerId,
                String.format("🚫 Your booking for \"%s\" (Booking #%d) has been cancelled.", resourceName, bookingId));
            default -> {} // No notification for other transitions
        }

        return saved;
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        bookingRepository.deleteById(bookingId);

        notificationService.createNotification(
        booking.getUser().getId(),
        String.format("Your booking for \"%s\" (Booking #%d) has been deleted.",
            booking.getResource().getName(), bookingId)
    );
    }
}
