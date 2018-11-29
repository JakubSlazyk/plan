package pack.controllers;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pack.service.EMailService;

@RestController
public class notificationController {

    @Autowired
    private EMailService eMailService;

    @PostMapping(value = "/sendNotification")
    public void sendNotification(@RequestBody JSONObject request) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Twoje zajęcia ")
                .append(request.get("className"))
                .append(" zostały przeniesione z ")
                .append(request.get("oldDate"))
                .append(" na ")
                .append(request.get("newDate"));
        String receiver = (String) request.get("email");
        eMailService.sendEmail(stringBuilder.toString(), receiver);
    }
}
