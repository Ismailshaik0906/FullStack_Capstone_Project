package com.example.payroll.controller;

import com.example.payroll.entity.Payroll;
import com.example.payroll.service.PayrollService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    @GetMapping("/{id}")
    public Payroll getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }

    @PostMapping("/employee/{employeeId}")
    public Payroll createPayroll(@PathVariable Long employeeId, @RequestBody Payroll payroll) {
        return payrollService.createPayroll(employeeId, payroll);
    }

    @PutMapping("/{id}")
    public Payroll updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll) {
        return payrollService.updatePayroll(id, payroll);
    }

    @PatchMapping("/{id}/lock")
    public Payroll lockPayroll(@PathVariable Long id) {
        return payrollService.lockPayroll(id);
    }

    @GetMapping("/my/{employeeId}/{year}/{month}")
    public Payroll getEmployeePayroll(@PathVariable Long employeeId,
                                      @PathVariable Integer year,
                                      @PathVariable Integer month) {
        return payrollService.getEmployeePayroll(employeeId, year, month);
    }
}
