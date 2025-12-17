package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.ProfessorRequest;
import br.com.julia.rgsurfschool.api.dto.ProfessorResponse;
import br.com.julia.rgsurfschool.domain.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfessorController {

    ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessorResponse>> findAll() {
        List<ProfessorResponse> professores = professorService.findAll();
        return new ResponseEntity<>(professores, HttpStatus.OK);
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

