package tz.lab.controller;

import tz.lab.model.Patient;
import tz.lab.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/patients")
public class PatientController {
 private final PatientRepository repo;
 public PatientController(PatientRepository repo){this.repo=repo;}

 public record PatientRequest(@NotBlank String fullName, LocalDate dateOfBirth, String sex, String phone, String address, String referredBy){}
 @GetMapping public List<Patient> all(@RequestParam(defaultValue="") String q){return q.isBlank()?repo.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,"registeredAt")):repo.search(q);}
 @GetMapping("/{id}") public Patient one(@PathVariable Long id){return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));}
 @PostMapping public Patient create(@Valid @RequestBody PatientRequest r){
  Patient p=new Patient(); p.setFullName(r.fullName().trim()); p.setDateOfBirth(r.dateOfBirth()); p.setSex(r.sex()); p.setPhone(r.phone()); p.setAddress(r.address()); p.setReferredBy(r.referredBy());
  p.setPatientNumber("PT-"+UUID.randomUUID().toString().substring(0,8).toUpperCase()); return repo.save(p);
 }
 @PutMapping("/{id}") public Patient update(@PathVariable Long id,@Valid @RequestBody PatientRequest r){
  Patient p=one(id); p.setFullName(r.fullName().trim()); p.setDateOfBirth(r.dateOfBirth()); p.setSex(r.sex()); p.setPhone(r.phone()); p.setAddress(r.address()); p.setReferredBy(r.referredBy()); return repo.save(p);
 }
}
