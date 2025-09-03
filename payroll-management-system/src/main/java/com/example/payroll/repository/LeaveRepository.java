package com.example.payroll.repository;


import com.example.payroll.entity.Leave;
import com.example.payroll.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByEmployeeEmployeeId(Long employeeId);
    List<Leave> findByStatus(LeaveStatus status);
}
