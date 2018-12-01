package pack.controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.MediaType;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;

@CrossOrigin(value = {"http://localhost:5000"})
@RestController()
public class LoggedUserController {

    @GetMapping(value = "/user", produces = { MediaType.APPLICATION_JSON_VALUE })
    public JSONObject getPlan(HttpServletRequest request, HttpServletResponse response) {
        JSONArray users = (JSONArray) getUsersFromFile("").get("users");
        String userName=request.getUserPrincipal().getName();
        System.out.println("USERNAME:"+userName);
        Object returnValue=null;
        Object role=null;
        for(Object user:users){
            JSONObject object = (JSONObject)user;
            if(userName.equals(object.get("user"))){
                returnValue = object.get("id");
                role=object.get("role");
            }
        }
        JSONObject id=new JSONObject();
        id.put("role",role);
        id.put("id",returnValue);
    return id;
    }

    private JSONObject getUsersFromFile(String path) {
        JSONParser parser = new JSONParser();
        try {
            FileReader reader = new FileReader(ResourceUtils.getFile("classpath:users.json"));
            Object obj = parser.parse(reader);
            reader.close();
            return (JSONObject) obj;
        } catch (Exception e) {
            return null;
        }
    }
}
