package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.ProfessorRequest;
import br.com.julia.rgsurfschool.api.dto.ProfessorResponse;
import br.com.julia.rgsurfschool.domain.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/professor")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessorResponse>> findAll() {
        return new ResponseEntity<>(professorService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponse> findById(@PathVariable Long id) {
        return new ResponseEntity<>(professorService.findById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProfessorResponse> create(@RequestBody ProfessorRequest request) {
        ProfessorResponse professor = professorService.create(request);
        return new ResponseEntity<>(professor, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponse> update(@PathVariable Long id, @RequestBody ProfessorRequest request) {
        ProfessorResponse professor = professorService.update(id, request);
        return new ResponseEntity<>(professor, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professorService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
