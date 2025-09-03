package com.example.payroll.service;

import com.example.payroll.entity.*;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.LeaveRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LeaveServiceTest {

    @Mock
    private LeaveRepository leaveRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private LeaveService leaveService;

    private Employee employee;
    private Leave leave;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        employee = new Employee();
        employee.setEmployeeId(1L);

        leave = new Leave();
        leave.setLeaveId(1L);
        leave.setEmployee(employee);
        leave.setStartDate(new Date());
        leave.setEndDate(new Date());
        leave.setLeaveType(LeaveType.SICK);
        leave.setStatus(LeaveStatus.PENDING);
    }

    @Test
    void testApplyLeave_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(leaveRepository.save(any(Leave.class))).thenReturn(leave);

        Leave result = leaveService.applyLeave(1L, leave);

        assertNotNull(result);
        assertEquals(LeaveStatus.PENDING, result.getStatus());
        assertEquals(LeaveType.SICK, result.getLeaveType());
        verify(leaveRepository).save(any(Leave.class));
    }

    @Test
    void testApplyLeave_EmployeeNotFound() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> leaveService.applyLeave(1L, leave));

        assertEquals("Employee not found with ID 1", ex.getMessage());
    }

    @Test
    void testGetEmployeeLeaves() {
        when(leaveRepository.findByEmployeeEmployeeId(1L)).thenReturn(List.of(leave));

        List<Leave> leaves = leaveService.getEmployeeLeaves(1L);

        assertEquals(1, leaves.size());
        assertEquals(LeaveType.SICK, leaves.get(0).getLeaveType());
    }

    @Test
    void testApproveLeave_Success() {
        when(leaveRepository.findById(1L)).thenReturn(Optional.of(leave));
        when(leaveRepository.save(any(Leave.class))).thenReturn(leave);

        Leave result = leaveService.approveLeave(1L);

        assertEquals(LeaveStatus.APPROVED, result.getStatus());
        verify(leaveRepository).save(leave);
    }

    @Test
    void testRejectLeave_Success() {
        when(leaveRepository.findById(1L)).thenReturn(Optional.of(leave));
        when(leaveRepository.save(any(Leave.class))).thenReturn(leave);

        Leave result = leaveService.rejectLeave(1L);

        assertEquals(LeaveStatus.REJECTED, result.getStatus());
        verify(leaveRepository).save(leave);
    }
}