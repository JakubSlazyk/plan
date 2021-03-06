package pack.controllers;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.FileReader;
import java.io.FileWriter;

@CrossOrigin(value = {"http://localhost:5000"})
@RestController()
public class prosbController {

    @GetMapping(value = "/prosby", produces = { MediaType.APPLICATION_JSON_VALUE })
    public JSONObject getAllProsby(HttpServletRequest request, HttpServletResponse response) {
        return getProsbyFromFile(request.getSession().getServletContext().getRealPath("/"));
    }

    @PostMapping(value = "/prosby", produces = { MediaType.APPLICATION_JSON_VALUE })
    public void addProsba(HttpServletRequest request, HttpServletResponse response, @RequestBody JSONObject prosby) {
        saveProsbyToFile(request.getSession().getServletContext().getRealPath("/"), prosby);
    }

    private JSONObject getProsbyFromFile(String path) {
        JSONParser parser = new JSONParser();
        try {
            Object obj = parser.parse(new FileReader(path + "/plan/prosby.json"));
            JSONObject jsonObject = (JSONObject) obj;
            return jsonObject;
        } catch (Exception e) {
            return null;
        }
    }

    private boolean saveProsbyToFile(String path, JSONObject jsonObject) {
        try (FileWriter file = new FileWriter(path + "/plan/prosby.json")) {
            file.write(jsonObject.toJSONString());
            file.flush();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
