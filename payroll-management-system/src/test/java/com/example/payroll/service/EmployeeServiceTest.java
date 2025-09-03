package com.example.payroll.service;

import com.example.payroll.dto.EmployeeRequest;
import com.example.payroll.entity.Department;
import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Job;
import com.example.payroll.entity.User;
import com.example.payroll.repository.DepartmentRepository;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.JobRepository;
import com.example.payroll.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;
    private EmployeeRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Sample employee
        employee = new Employee();
        employee.setEmployeeId(1L);
        employee.setFirstName("John");
        employee.setLastName("Doe");

        // Sample request
        request = new EmployeeRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setDob(new Date());
        request.setPhone("1234567890");
        request.setAddress("Street 123");
        request.setDepartmentId(1L);
        request.setJobId(1L);
        request.setUserId(1L);
    }

    @Test
    void testGetEmployeeById_Found() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        Employee found = employeeService.getEmployeeById(1L);

        assertNotNull(found);
        assertEquals("John", found.getFirstName());
    }

    @Test
    void testGetEmployeeById_NotFound() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> employeeService.getEmployeeById(1L));

        assertEquals("Employee not found with ID 1", ex.getMessage());
    }

    @Test
    void testCreateEmployee_Success() {
        Department dept = new Department();
        dept.setDepartmentId(1L);

        Job job = new Job();
        job.setJobId(1L);

        User user = new User();
        user.setUserId(1L);

        when(departmentRepository.findById(1L)).thenReturn(Optional.of(dept));
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        Employee created = employeeService.createEmployee(request);

        assertNotNull(created);
        assertEquals("John", created.getFirstName());
        verify(employeeRepository).save(any(Employee.class));
    }
}