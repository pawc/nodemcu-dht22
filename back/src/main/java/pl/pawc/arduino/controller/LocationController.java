package pl.pawc.arduino.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import pl.pawc.arduino.entity.Location;
import pl.pawc.arduino.repository.LocationRepository;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class LocationController {

    @Value("${password}")
    private String password;

    private final LocationRepository locationRepository;

    @GetMapping("/locations")
    @CrossOrigin
    public List<Location> locations(
            @RequestParam("pass") String passwordInput,
            HttpServletResponse response){

        if(!password.equals(passwordInput)){
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return null;
        }

        return locationRepository.findAll();

    }

}