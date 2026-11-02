package tz.lab.controller;

import tz.lab.repo.*;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
 private final PatientRepository patients; private final LabOrderRepository orders;
 public DashboardController(PatientRepository patients,LabOrderRepository orders){this.patients=patients;this.orders=orders;}
 @GetMapping("/summary") public Map<String,Object> summary(){
  LocalDateTime start=LocalDate.now().atStartOfDay(), end=start.plusDays(1).minusNanos(1);
  return Map.of("totalPatients",patients.count(),"totalOrders",orders.count(),
   "todayPatients",patients.findAll().stream().filter(p->p.getRegisteredAt()!=null && !p.getRegisteredAt().isBefore(start) && !p.getRegisteredAt().isAfter(end)).count(),
   "todayOrders",orders.countByCreatedAtBetween(start,end),
   "todayRevenue",orders.revenueBetween(start,end),
   "outstandingBalance",orders.outstandingBalance(),
   "recentOrders",orders.findAllByOrderByCreatedAtDesc().stream().limit(8).toList());
 }
}
