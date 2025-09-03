package com.example.payroll.service;

import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Payroll;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.PayrollRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    // Get all payroll records
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    // Get payroll by ID
    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with ID " + id));
    }

    // Create payroll for employee
    public Payroll createPayroll(Long employeeId, Payroll payrollDetails) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID " + employeeId));

        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setBasicSalary(payrollDetails.getBasicSalary());
        payroll.setBonus(payrollDetails.getBonus());
        payroll.setDeductions(payrollDetails.getDeductions());

        // Net salary = basic + bonus - deductions
        double netSalary = payrollDetails.getBasicSalary() 
                         + (payrollDetails.getBonus() != null ? payrollDetails.getBonus() : 0)
                         - (payrollDetails.getDeductions() != null ? payrollDetails.getDeductions() : 0);
        payroll.setNetSalary(netSalary);

        payroll.setYear(payrollDetails.getYear());
        payroll.setMonth(payrollDetails.getMonth());
        payroll.setPayDate(new Date());
        payroll.setLocked(false);

        return payrollRepository.save(payroll);
    }

    // Update payroll (only if not locked)

    public Payroll updatePayroll(Long id, Payroll payrollDetails) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with ID " + id));

        if (Boolean.TRUE.equals(payroll.getLocked())) {
            throw new RuntimeException("Payroll is locked and cannot be updated.");
        }

        payroll.setBasicSalary(payrollDetails.getBasicSalary());
        payroll.setBonus(payrollDetails.getBonus());
        payroll.setDeductions(payrollDetails.getDeductions());
        payroll.setYear(payrollDetails.getYear());
        payroll.setMonth(payrollDetails.getMonth());

        double netSalary = payrollDetails.getBasicSalary()
                + (payrollDetails.getBonus() != null ? payrollDetails.getBonus() : 0)
                - (payrollDetails.getDeductions() != null ? payrollDetails.getDeductions() : 0);
        payroll.setNetSalary(netSalary);

        return payrollRepository.save(payroll);
    }

    // Lock payroll (finalize)
    public Payroll lockPayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with ID " + id));

        payroll.setLocked(true);
        return payrollRepository.save(payroll);
    }

    // Get payroll for employee by year & month (employee’s payslip)
    public Payroll getEmployeePayroll(Long employeeId, Integer year, Integer month) {
        return payrollRepository.findByEmployeeEmployeeIdAndYearAndMonth(employeeId, year, month);
    }
}
