package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.EquipamentoRequest;
import br.com.julia.rgsurfschool.api.dto.EquipamentoResponse;
import br.com.julia.rgsurfschool.domain.service.EquipamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/equipamento")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipamentoController {

    private final EquipamentoService equipamentoService;

    public EquipamentoController(EquipamentoService equipamentoService) {
        this.equipamentoService = equipamentoService;
    }

    @GetMapping
    public ResponseEntity<List<EquipamentoResponse>> findAll() {
        return new ResponseEntity<>(equipamentoService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipamentoResponse> findById(@PathVariable Long id) {
        return new ResponseEntity<>(equipamentoService.findById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<EquipamentoResponse> create(@RequestBody EquipamentoRequest request) {
        EquipamentoResponse response = equipamentoService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipamentoResponse> update(@PathVariable Long id, @RequestBody EquipamentoRequest request) {
        EquipamentoResponse response = equipamentoService.update(id, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        equipamentoService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
