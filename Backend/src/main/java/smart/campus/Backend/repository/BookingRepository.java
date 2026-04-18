package smart.campus.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smart.campus.Backend.entity.Booking;
import smart.campus.Backend.entity.enums.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.resource LEFT JOIN FETCH b.user")
    List<Booking> findAllWithRelations();

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.resource LEFT JOIN FETCH b.user WHERE b.id = :id")
    Optional<Booking> findByIdWithRelations(@Param("id") Long id);

    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.resource LEFT JOIN FETCH b.user WHERE b.user.id = :userId")
    List<Booking> findByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId AND b.status IN :statuses " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );
}
