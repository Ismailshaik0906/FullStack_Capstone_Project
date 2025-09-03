package com.example.payroll.controller;

import com.example.payroll.entity.Payroll;
import com.example.payroll.repository.PayrollRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportsController {

    private final PayrollRepository payrollRepository;

    public ReportsController(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    // Payroll Summary Report (for a given month/year)
    @GetMapping("/payroll-summary")
    public List<Payroll> getPayrollSummary(@RequestParam Integer year,
                                           @RequestParam Integer month) {
        return payrollRepository.findAll()
                .stream()
                .filter(p -> Objects.equals(p.getYear(), year) && Objects.equals(p.getMonth(), month))
                .collect(Collectors.toList());
    }

    // Department-wise cost report
    @GetMapping("/department-cost")
    public Map<String, Double> getDepartmentCost(@RequestParam Integer year,
                                                 @RequestParam Integer month) {
        List<Payroll> payrolls = payrollRepository.findAll()
                .stream()
                .filter(p -> Objects.equals(p.getYear(), year) && Objects.equals(p.getMonth(), month))
                .toList();

        Map<String, Double> departmentCosts = new HashMap<>();
        for (Payroll payroll : payrolls) {
            String dept = payroll.getEmployee().getDepartment().getName();
            departmentCosts.put(dept,
                    departmentCosts.getOrDefault(dept, 0.0) + payroll.getNetSalary());
        }

        return departmentCosts;
    }
}
