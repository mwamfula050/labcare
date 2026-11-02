package tz.lab.controller;

import tz.lab.model.*;
import tz.lab.repo.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/orders")
public class OrderController {
 private final LabOrderRepository orders; private final PatientRepository patients;
 public OrderController(LabOrderRepository orders,PatientRepository patients){this.orders=orders;this.patients=patients;}

 public record OrderRequest(Long patientId,String testName,String priority,BigDecimal price){}
 public record PaymentRequest(BigDecimal amount){}
 public record ResultRequest(String resultText,String performedBy){}
 public record StatusRequest(String status){}

 @GetMapping public List<LabOrder> all(){return orders.findAllByOrderByCreatedAtDesc();}
 @PostMapping public LabOrder create(@RequestBody OrderRequest r){
  if(r.patientId()==null || r.testName()==null || r.testName().isBlank() || r.price()==null || r.price().signum()<0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Patient, test and valid price are required");
  Patient p=patients.findById(r.patientId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));
  LabOrder o=new LabOrder(); o.setPatient(p); o.setTestName(r.testName().trim()); o.setPriority(r.priority()==null?"NORMAL":r.priority()); o.setPrice(r.price()); o.setOrderNumber("LAB-"+UUID.randomUUID().toString().substring(0,8).toUpperCase()); return orders.save(o);
 }
 @PatchMapping("/{id}/payment") public LabOrder payment(@PathVariable Long id,@RequestBody PaymentRequest r){
  LabOrder o=one(id); if(r.amount()==null || r.amount().signum()<=0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Payment must be greater than zero");
  if(o.getAmountPaid().add(r.amount()).compareTo(o.getPrice())>0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Payment exceeds outstanding balance");
  o.setAmountPaid(o.getAmountPaid().add(r.amount())); return orders.save(o);
 }
 @PatchMapping("/{id}/result") public LabOrder result(@PathVariable Long id,@RequestBody ResultRequest r){
  LabOrder o=one(id); o.setResultText(r.resultText()); o.setPerformedBy(r.performedBy()); o.setStatus("COMPLETED"); o.setCompletedAt(LocalDateTime.now()); return orders.save(o);
 }
 @PatchMapping("/{id}/status") public LabOrder status(@PathVariable Long id,@RequestBody StatusRequest r){
  LabOrder o=one(id); if(!List.of("PENDING","IN_PROGRESS","COMPLETED","CANCELLED").contains(r.status())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid status"); o.setStatus(r.status()); return orders.save(o);
 }
 private LabOrder one(Long id){return orders.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Order not found"));}
}
