package tz.lab.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="lab_orders")
public class LabOrder {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, length=40, unique=true) private String orderNumber;
    @ManyToOne(optional=false) @JoinColumn(name="patient_id") private Patient patient;
    @Column(nullable=false, length=120) private String testName;
    @Column(length=40) private String priority = "NORMAL";
    @Column(nullable=false, precision=12, scale=2) private BigDecimal price = BigDecimal.ZERO;
    @Column(nullable=false, precision=12, scale=2) private BigDecimal amountPaid = BigDecimal.ZERO;
    @Column(nullable=false, length=30) private String status = "PENDING";
    @Column(columnDefinition="TEXT") private String resultText;
    @Column(length=100) private String performedBy;
    @Column(nullable=false) private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getOrderNumber(){return orderNumber;} public void setOrderNumber(String v){orderNumber=v;}
    public Patient getPatient(){return patient;} public void setPatient(Patient v){patient=v;}
    public String getTestName(){return testName;} public void setTestName(String v){testName=v;}
    public String getPriority(){return priority;} public void setPriority(String v){priority=v;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal v){price=v;}
    public BigDecimal getAmountPaid(){return amountPaid;} public void setAmountPaid(BigDecimal v){amountPaid=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getResultText(){return resultText;} public void setResultText(String v){resultText=v;}
    public String getPerformedBy(){return performedBy;} public void setPerformedBy(String v){performedBy=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
    public LocalDateTime getCompletedAt(){return completedAt;} public void setCompletedAt(LocalDateTime v){completedAt=v;}
    @Transient public BigDecimal getBalance(){return price.subtract(amountPaid);}
    @Transient public String getPaymentStatus(){return amountPaid.compareTo(price)>=0 ? "PAID" : amountPaid.signum()>0 ? "PARTIAL" : "UNPAID";}
}
