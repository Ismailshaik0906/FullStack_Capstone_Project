package com.example.payroll.repository;


import com.example.payroll.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployeeEmployeeId(Long employeeId);
    Payroll findByEmployeeEmployeeIdAndYearAndMonth(Long employeeId, Integer year, Integer month);
}
