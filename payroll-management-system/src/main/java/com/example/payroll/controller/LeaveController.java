package com.example.payroll.controller;

import com.example.payroll.entity.Leave;
import com.example.payroll.service.LeaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/employee/{employeeId}")
    public Leave applyLeave(@PathVariable Long employeeId, @RequestBody Leave leave) {
        return leaveService.applyLeave(employeeId, leave);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Leave> getEmployeeLeaves(@PathVariable Long employeeId) {
        return leaveService.getEmployeeLeaves(employeeId);
    }

    @GetMapping("/pending")
    public List<Leave> getPendingLeaves() {
        return leaveService.getPendingLeaves();
    }

    @PatchMapping("/{id}/approve")
    public Leave approveLeave(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    @PatchMapping("/{id}/reject")
    public Leave rejectLeave(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }
}
