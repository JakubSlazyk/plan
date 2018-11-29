package pack.controllers;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;
import java.io.FileWriter;

@CrossOrigin(value = {"http://localhost:5000"})
@RestController("/")
public class planController {

    @GetMapping(value = "plann",produces = { MediaType.APPLICATION_JSON_VALUE })
    public JSONObject getPlan(HttpServletRequest request, HttpServletResponse response){
        return getPlanFromFile(request.getSession().getServletContext().getRealPath("/"));
    }

    @PostMapping(value = "plann",produces = {MediaType.APPLICATION_JSON_VALUE})
    public void setPlan(HttpServletRequest request, HttpServletResponse response,@RequestBody JSONObject plan){
        savePlanToFile(request.getSession().getServletContext().getRealPath("/"),plan);
    }

    private JSONObject getPlanFromFile(String path){
        JSONParser parser = new JSONParser();
        try {
            FileReader reader=new FileReader(path + "/plan/plan.json");
            Object obj = parser.parse(reader);
            reader.close();
            JSONObject jsonObject = (JSONObject) obj;
            return jsonObject;
        }catch (Exception e){
            return null;
        }

    }

    private boolean savePlanToFile(String path,JSONObject jsonObject){
        try (FileWriter file = new FileWriter(path + "/plan/plan.json")) {

            file.write(jsonObject.toJSONString());
            file.flush();

            return true;
        } catch (Exception e){
            return false;
        }
    }

}
