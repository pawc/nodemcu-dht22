package pl.pawc.arduino.repository;

import org.springframework.data.repository.CrudRepository;
import pl.pawc.arduino.entity.Location;

import java.util.List;

public interface LocationRepository extends CrudRepository<Location, Long> {

    List<Location> findAll();
    Location findOneByName(String name);

}