package tz.lab.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="patients")
public class Patient {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, length=140) private String fullName;
    @Column(nullable=false, unique=true, length=40) private String patientNumber;
    private LocalDate dateOfBirth;
    @Column(length=20) private String sex;
    @Column(length=30) private String phone;
    @Column(length=255) private String address;
    @Column(length=80) private String referredBy;
    @Column(nullable=false) private LocalDateTime registeredAt = LocalDateTime.now();

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
    public String getPatientNumber(){return patientNumber;} public void setPatientNumber(String v){patientNumber=v;}
    public LocalDate getDateOfBirth(){return dateOfBirth;} public void setDateOfBirth(LocalDate v){dateOfBirth=v;}
    public String getSex(){return sex;} public void setSex(String v){sex=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
    public String getAddress(){return address;} public void setAddress(String v){address=v;}
    public String getReferredBy(){return referredBy;} public void setReferredBy(String v){referredBy=v;}
    public LocalDateTime getRegisteredAt(){return registeredAt;} public void setRegisteredAt(LocalDateTime v){registeredAt=v;}
}
