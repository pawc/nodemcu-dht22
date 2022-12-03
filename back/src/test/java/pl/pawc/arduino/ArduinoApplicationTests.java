package pl.pawc.arduino;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import pl.pawc.arduino.entity.Location;
import pl.pawc.arduino.entity.Record;
import pl.pawc.arduino.repository.RecordRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@SpringBootTest
class ArduinoApplicationTests {

	@Autowired
	RecordRepository recordRepository;

	@Test
	void test() {
	}

}
