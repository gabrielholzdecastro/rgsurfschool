package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.VendaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.VendaResponse;
import br.com.julia.rgsurfschool.domain.service.VendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendaController {

    private final VendaService vendaService;

    @PostMapping
    public ResponseEntity<VendaResponse> realizarVenda(@RequestBody VendaCreateRequest request) {
        VendaResponse response = vendaService.realizarVenda(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<VendaResponse>> listarVendas() {
        return ResponseEntity.ok(vendaService.listarVendas());
    }

    @PutMapping("/{id}/quitar")
    public ResponseEntity<Void> quitarVenda(@PathVariable Long id) {
        vendaService.quitarVenda(id);
        return ResponseEntity.noContent().build();
    }
}
