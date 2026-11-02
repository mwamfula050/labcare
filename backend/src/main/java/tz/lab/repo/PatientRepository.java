package tz.lab.repo;
import tz.lab.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface PatientRepository extends JpaRepository<Patient,Long> {
 @Query("select p from Patient p where lower(p.fullName) like lower(concat('%',:q,'%')) or lower(p.patientNumber) like lower(concat('%',:q,'%')) or p.phone like concat('%',:q,'%') order by p.registeredAt desc")
 List<Patient> search(@Param("q") String q);
}
