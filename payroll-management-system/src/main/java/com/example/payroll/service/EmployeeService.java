package com.example.payroll.service;

import com.example.payroll.entity.Employee;
import com.example.payroll.entity.Department;
import com.example.payroll.entity.Job;
import com.example.payroll.entity.User;
import com.example.payroll.dto.EmployeeRequest;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.DepartmentRepository;
import com.example.payroll.repository.JobRepository;
import com.example.payroll.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           JobRepository jobRepository,
                           UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }
    
    

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID " + id));
    }
    public Employee getEmployeeByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));

        return employeeRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Employee not found for user " + user.getUserId()));
    }

    public Employee createEmployee(EmployeeRequest request) {
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Employee emp = new Employee();
        emp.setFirstName(request.getFirstName());
        emp.setLastName(request.getLastName());
        emp.setDob(request.getDob());
        emp.setPhone(request.getPhone());
        emp.setAddress(request.getAddress());
        emp.setDepartment(dept);
        emp.setJob(job);
        emp.setUser(user);

        return employeeRepository.save(emp);
    }

    public Employee updateEmployee(Long id, EmployeeRequest request) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID " + id));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        emp.setFirstName(request.getFirstName());
        emp.setLastName(request.getLastName());
        emp.setDob(request.getDob());
        emp.setPhone(request.getPhone());
        emp.setAddress(request.getAddress());
        emp.setDepartment(dept);
        emp.setJob(job);
        emp.setUser(user);

        return employeeRepository.save(emp);
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with ID " + id);
        }
        employeeRepository.deleteById(id);
    }
}