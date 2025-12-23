package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.TipoGuarderiaResponse;
import br.com.julia.rgsurfschool.api.dto.TipoGuarderiaUpdateRequest;
import br.com.julia.rgsurfschool.domain.service.TipoGuarderiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipo-guarderia")
@CrossOrigin(origins = "http://localhost:3000")
public class TipoGuarderiaController {

    private final TipoGuarderiaService tipoGuarderiaService;

    public TipoGuarderiaController(TipoGuarderiaService tipoGuarderiaService) {
        this.tipoGuarderiaService = tipoGuarderiaService;
    }

    @GetMapping
    public ResponseEntity<List<TipoGuarderiaResponse>> listar() {
        return ResponseEntity.ok(tipoGuarderiaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoGuarderiaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tipoGuarderiaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoGuarderiaResponse> atualizar(@PathVariable Long id, @RequestBody TipoGuarderiaUpdateRequest request) {
        return ResponseEntity.ok(tipoGuarderiaService.atualizar(id, request));
    }
}

