package tz.lab.repo;
import tz.lab.model.LabOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public interface LabOrderRepository extends JpaRepository<LabOrder,Long> {
 List<LabOrder> findAllByOrderByCreatedAtDesc();
 long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
 @Query("select coalesce(sum(o.amountPaid),0) from LabOrder o where o.createdAt between :start and :end")
 BigDecimal revenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
 @Query("select coalesce(sum(o.price-o.amountPaid),0) from LabOrder o")
 BigDecimal outstandingBalance();
}
