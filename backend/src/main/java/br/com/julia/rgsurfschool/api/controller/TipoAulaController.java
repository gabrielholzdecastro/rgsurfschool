package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.TipoAulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.TipoAulaResponse;
import br.com.julia.rgsurfschool.api.dto.TipoAulaUpdateRequest;
import br.com.julia.rgsurfschool.domain.service.TipoAulaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipo-aula")
@CrossOrigin(origins = "http://localhost:3000")
public class TipoAulaController {

    private final TipoAulaService tipoAulaService;

    public TipoAulaController(TipoAulaService tipoAulaService) {
        this.tipoAulaService = tipoAulaService;
    }

    @PostMapping
    public ResponseEntity<TipoAulaResponse> criar(@RequestBody TipoAulaCreateRequest request) {
        TipoAulaResponse tipoAula = tipoAulaService.criar(request);
        return new ResponseEntity<>(tipoAula, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TipoAulaResponse>> listar() {
        return ResponseEntity.ok(tipoAulaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoAulaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tipoAulaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoAulaResponse> atualizar(@PathVariable Long id, @RequestBody TipoAulaUpdateRequest request) {
        return ResponseEntity.ok(tipoAulaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tipoAulaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

