package com.example.payroll.service;

import com.example.payroll.entity.Department;
import com.example.payroll.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentService departmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //  Test getDepartmentById
    @Test
    void testGetDepartmentById() {
        Department dept = new Department();
        dept.setDepartmentId(1L);
        dept.setName("HR");
        dept.setDescription("Human Resources");

        when(departmentRepository.findById(1L)).thenReturn(Optional.of(dept));

        Department result = departmentService.getDepartmentById(1L);

        assertNotNull(result);
        assertEquals("HR", result.getName());
        assertEquals("Human Resources", result.getDescription());
    }

    // Test createDepartment
    @Test
    void testCreateDepartment() {
        Department dept = new Department();
        dept.setName("Finance");
        dept.setDescription("Handles money");

        when(departmentRepository.save(dept)).thenReturn(dept);

        Department result = departmentService.createDepartment(dept);

        assertNotNull(result);
        assertEquals("Finance", result.getName());
        assertEquals("Handles money", result.getDescription());
    }

   
}