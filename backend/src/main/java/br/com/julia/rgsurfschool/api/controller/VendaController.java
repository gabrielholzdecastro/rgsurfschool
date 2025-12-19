package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.VendaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.VendaResponse;
import br.com.julia.rgsurfschool.domain.service.VendaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "http://localhost:3000")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping
    public ResponseEntity<VendaResponse> realizarVenda(@RequestBody VendaCreateRequest request) {
        VendaResponse response = vendaService.realizarVenda(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<VendaResponse>> listarVendas() {
        return ResponseEntity.ok(vendaService.listarVendas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponse> buscarPorId(@PathVariable Long id) {
        VendaResponse venda = vendaService.buscarPorId(id);
        return ResponseEntity.ok(venda);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendaResponse> atualizarVenda(@PathVariable Long id, @RequestBody VendaCreateRequest request) {
        VendaResponse venda = vendaService.atualizarVenda(id, request);
        return ResponseEntity.ok(venda);
    }

    @PutMapping("/{id}/quitar")
    public ResponseEntity<Void> quitarVenda(@PathVariable Long id) {
        vendaService.quitarVenda(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirVenda(@PathVariable Long id) {
        vendaService.excluirVenda(id);
        return ResponseEntity.noContent().build();
    }
}
