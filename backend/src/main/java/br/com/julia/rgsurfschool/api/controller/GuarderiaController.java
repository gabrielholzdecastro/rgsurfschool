package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.GuarderiaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.GuarderiaResponse;
import br.com.julia.rgsurfschool.api.dto.GuarderiaUpdateRequest;
import br.com.julia.rgsurfschool.domain.service.GuarderiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guarderia")
@CrossOrigin(origins = "http://localhost:3000")
public class GuarderiaController {

    private final GuarderiaService guarderiaService;

    public GuarderiaController(GuarderiaService guarderiaService) {
        this.guarderiaService = guarderiaService;
    }

    @GetMapping
    public ResponseEntity<List<GuarderiaResponse>> listar() {
        return ResponseEntity.ok(guarderiaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuarderiaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(guarderiaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<GuarderiaResponse> criar(@RequestBody GuarderiaCreateRequest request) {
        GuarderiaResponse guarderia = guarderiaService.criar(request);
        return new ResponseEntity<>(guarderia, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuarderiaResponse> atualizar(@PathVariable Long id, @RequestBody GuarderiaUpdateRequest request) {
        return ResponseEntity.ok(guarderiaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        guarderiaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

