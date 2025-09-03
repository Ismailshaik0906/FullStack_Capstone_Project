package com.example.payroll.service;

import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Leave;
import com.example.payroll.entity.LeaveStatus;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveService(LeaveRepository leaveRepository, EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    // Employee: apply for leave
    public Leave applyLeave(Long employeeId, Leave leaveDetails) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID " + employeeId));

        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setStartDate(leaveDetails.getStartDate());
        leave.setEndDate(leaveDetails.getEndDate());
        leave.setLeaveType(leaveDetails.getLeaveType());
        leave.setStatus(LeaveStatus.PENDING);

        return leaveRepository.save(leave);
    }

    // Employee: view their leaves
    public List<Leave> getEmployeeLeaves(Long employeeId) {
        return leaveRepository.findByEmployeeEmployeeId(employeeId);
    }

   
    public List<Leave> getPendingLeaves() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING);
    }

   
    public Leave approveLeave(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found with ID " + leaveId));
        leave.setStatus(LeaveStatus.APPROVED);
        return leaveRepository.save(leave);
    }

    
    public Leave rejectLeave(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found with ID " + leaveId));
        leave.setStatus(LeaveStatus.REJECTED);
        return leaveRepository.save(leave);
    }
}
