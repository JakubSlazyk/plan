package pack.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RedirectController {
    @RequestMapping(value = "/")
    public String redirectToIndex() {
        return "redirect:./plan/index.html";
    }
}
