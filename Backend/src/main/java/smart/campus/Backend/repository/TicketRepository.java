package smart.campus.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import smart.campus.Backend.entity.Ticket;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.resource LEFT JOIN FETCH t.reporter LEFT JOIN FETCH t.assignee")
    List<Ticket> findAllWithRelations();

    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.resource LEFT JOIN FETCH t.reporter LEFT JOIN FETCH t.assignee WHERE t.id = :id")
    Optional<Ticket> findByIdWithRelations(@org.springframework.data.repository.query.Param("id") Long id);

    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.resource LEFT JOIN FETCH t.reporter LEFT JOIN FETCH t.assignee WHERE t.reporter.id = :reporterId")
    List<Ticket> findByReporterId(@org.springframework.data.repository.query.Param("reporterId") Long reporterId);

    List<Ticket> findByAssigneeId(Long assigneeId);
}
