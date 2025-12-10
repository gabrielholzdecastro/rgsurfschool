package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.AulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AulaResponse;
import br.com.julia.rgsurfschool.domain.service.AulaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "http://localhost:3000")
public class AulaController {

    private final AulaService aulaService;

    public AulaController(AulaService aulaService) {
        this.aulaService = aulaService;
    }

    @PostMapping
    public ResponseEntity<AulaResponse> criarAula(@RequestBody AulaCreateRequest request) {
        AulaResponse aula = aulaService.criarAula(request);
        return new ResponseEntity<>(aula, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AulaResponse>> listarAulas() {
        return ResponseEntity.ok(aulaService.listarAulas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AulaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(aulaService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAula(@PathVariable Long id) {
        aulaService.deletarAula(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AulaResponse> atualizarAula(@PathVariable Long id, @RequestBody AulaCreateRequest request) {
        return ResponseEntity.ok(aulaService.atualizarAula(id, request));
    }

    @PatchMapping("/{id}/quitar")
    public ResponseEntity<Void> quitarAula(@PathVariable Long id) {
        aulaService.quitarAula(id);
        return ResponseEntity.noContent().build();
    }
}
