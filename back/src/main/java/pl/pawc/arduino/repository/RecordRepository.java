package pl.pawc.arduino.repository;

import org.springframework.data.repository.CrudRepository;
import pl.pawc.arduino.entity.Location;
import pl.pawc.arduino.entity.Record;

import java.time.LocalDateTime;
import java.util.List;

public interface RecordRepository extends CrudRepository<Record, Long> {

    List<Record> findAll();
    List<Record> findAllByLocation(Location location);

    List<Record> findAllByTimestampBetween(LocalDateTime start, LocalDateTime end);
    List<Record> findAllByLocationNameAndTimestampBetween(String location, LocalDateTime start, LocalDateTime end);

}