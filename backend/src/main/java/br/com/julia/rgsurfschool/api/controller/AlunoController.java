package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AlunoCreateResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoFindAllResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoUpdateRequest;
import br.com.julia.rgsurfschool.domain.service.AlunoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aluno")
@CrossOrigin(origins = "http://localhost:3000")
public class AlunoController {

    AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    public ResponseEntity<List<AlunoFindAllResponse>> findAll() {
        List<AlunoFindAllResponse> alunos = alunoService.findAll();
        return new ResponseEntity<>(alunos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoFindAllResponse> findById(@PathVariable Long id) {
        AlunoFindAllResponse aluno = alunoService.findById(id);
        return new ResponseEntity<>(aluno, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AlunoCreateResponse> create(@RequestBody AlunoCreateRequest request) {
        AlunoCreateResponse aluno = alunoService.create(request);
        return new ResponseEntity<>(aluno, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoCreateResponse> update(@PathVariable Long id, @RequestBody AlunoUpdateRequest request) {
        AlunoCreateResponse aluno = alunoService.update(id, request);
        return new ResponseEntity<>(aluno, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alunoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
