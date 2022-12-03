package pl.pawc.arduino.controller;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import pl.pawc.arduino.entity.Location;
import pl.pawc.arduino.entity.Record;
import pl.pawc.arduino.repository.LocationRepository;
import pl.pawc.arduino.repository.RecordRepository;

import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecordController {

    @Value("${password}")
    private String password;

    private static final Logger logger = LogManager.getLogger(RecordController.class);

    private final RecordRepository recordRepository;

    private final LocationRepository locationRepository;

    @GetMapping("/all")
    @CrossOrigin
    public List<Record> getAll(
            @RequestParam("pass") String passwordInput,
            @RequestParam(name="start", required = false) String startS, // accepted format 2022-11-25T15:00
            @RequestParam(name="end", required = false) String endS,
            HttpServletResponse response){

        if(!password.equals(passwordInput)){
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }

        List<Record> results;
        LocalDateTime start = null;
        LocalDateTime end = null;

        if(startS != null && endS != null){
            try {
                start = LocalDateTime.parse(startS);
                end = LocalDateTime.parse(endS);
            }
            catch(DateTimeParseException e){
                e.printStackTrace();
            }
        }

        if(start != null && end != null){
            results = recordRepository.findAllByTimestampBetween(start, end);
        }
        else {
            results = recordRepository.findAll();
        }

        results.forEach(record -> record.setTimestamp(record.getTimestamp().truncatedTo(ChronoUnit.MINUTES)));

        return results;

    }

    @GetMapping("/location/{location}")
    @CrossOrigin
    public List<Record> getByLocation(
            @PathVariable String location,
            @RequestParam(name="start", required = false) String startS, // accepted format 2022-11-25T15:00
            @RequestParam(name="end", required = false) String endS,
            @RequestParam("pass") String passwordInput,
            HttpServletResponse response){

        if(!password.equals(passwordInput)){
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }

        Location locationByName = locationRepository.findOneByName(location);

        if(locationByName == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return null;
        }

        List<Record> results;
        LocalDateTime start = null;
        LocalDateTime end = null;

        if(startS != null && endS != null){
            try {
                start = LocalDateTime.parse(startS);
                end = LocalDateTime.parse(endS);
            }
            catch(DateTimeParseException e){
                e.printStackTrace();
            }
        }

        if(start != null && end != null){
            results = recordRepository.findAllByLocationNameAndTimestampBetween(location, start, end);
        }
        else {
            results = recordRepository.findAllByLocation(locationByName);
        }

        results.forEach(record -> record.setTimestamp(record.getTimestamp().truncatedTo(ChronoUnit.MINUTES)));

        return results;

    }

    @PostMapping("/location/{location}")
    public void post(HttpServletResponse response,
         @PathVariable String location,
         @RequestParam("t") String temperatureInput,
         @RequestParam(name = "h", required = false) String humidityInput,
         @RequestParam(name = "p", required = false) String pressureInput,
         @RequestParam("pass") String passwordInput){

        if(!password.equals(passwordInput)){
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        Location locationByName = locationRepository.findOneByName(location);

        if(locationByName == null){
            locationByName = new Location(location);
            locationRepository.save(locationByName);
            logger.info("New location {}", location);
        }

        BigDecimal temperature;
        BigDecimal humidity;
        BigDecimal pressure;

        try{
            temperature = new BigDecimal(temperatureInput);
            humidity = humidityInput != null ? new BigDecimal(humidityInput) : BigDecimal.ZERO;
            pressure = pressureInput != null ? new BigDecimal(pressureInput) : BigDecimal.ZERO;
        }
        catch(NumberFormatException ex) {
            ex.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try{
            Record record = new Record();

            record.setLocation(locationByName);
            record.setTemperature(temperature);
            record.setHumidity(humidity);
            record.setPressure(pressure);

            record.setTimestamp(LocalDateTime.now());

            recordRepository.save(record);
            logger.info("POST Record {}", record);
            response.setStatus(HttpServletResponse.SC_ACCEPTED);
        }
        catch(Throwable ex){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }

    }

}