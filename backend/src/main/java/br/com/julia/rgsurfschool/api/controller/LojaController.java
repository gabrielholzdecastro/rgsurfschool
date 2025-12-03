package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.LojaRequest;
import br.com.julia.rgsurfschool.api.dto.LojaResponse;
import br.com.julia.rgsurfschool.domain.service.LojaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loja")
@CrossOrigin(origins = "http://localhost:3000")
public class LojaController {

    LojaService lojaService;

    public LojaController(LojaService lojaService) {
        this.lojaService = lojaService;
    }

    @GetMapping
    public ResponseEntity<List<LojaResponse>> findAll() {
        List<LojaResponse> lojas = lojaService.findAll();
        return new ResponseEntity<>(lojas, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<LojaResponse> create(@RequestBody LojaRequest request) {
        LojaResponse loja = lojaService.create(request);
        return new ResponseEntity<>(loja, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LojaResponse> update(@PathVariable Long id, @RequestBody LojaRequest request) {
        LojaResponse loja = lojaService.update(id, request);
        return new ResponseEntity<>(loja, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lojaService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

