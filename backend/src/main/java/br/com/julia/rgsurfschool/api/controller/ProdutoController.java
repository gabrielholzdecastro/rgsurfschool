package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.ProdutoRequest;
import br.com.julia.rgsurfschool.api.dto.ProdutoResponse;
import br.com.julia.rgsurfschool.domain.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProdutoController {

    ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> findAll() {
        List<ProdutoResponse> produtos = produtoService.findAll();
        return new ResponseEntity<>(produtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProdutoResponse> create(@RequestBody ProdutoRequest request) {
        ProdutoResponse produto = produtoService.create(request);
        return new ResponseEntity<>(produto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponse> update(@PathVariable Long id, @RequestBody ProdutoRequest request) {
        ProdutoResponse produto = produtoService.update(id, request);
        return new ResponseEntity<>(produto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produtoService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

