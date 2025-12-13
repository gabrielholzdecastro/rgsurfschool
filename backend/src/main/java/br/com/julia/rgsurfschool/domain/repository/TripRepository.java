package br.com.julia.rgsurfschool.domain.repository;

import br.com.julia.rgsurfschool.domain.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
