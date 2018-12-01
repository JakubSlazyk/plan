package pack.security;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.util.ResourceUtils;

import java.io.FileReader;
import java.io.FileWriter;
import java.util.Set;

@Configuration
@EnableWebSecurity
@EnableGlobalAuthentication
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/**").hasAnyRole("WYKLADOWCA", "STUDENT").and().authorizeRequests()
                .antMatchers("/plann").permitAll().antMatchers("/osoby").permitAll().antMatchers("/prosby").permitAll()
                .and().formLogin().and().csrf().disable();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

        JSONArray users = (JSONArray) getUsersFromFile("").get("users");
        users.forEach(user -> {
            JSONObject usr = (JSONObject) user;
            try {
                auth.inMemoryAuthentication().withUser((String) usr.get("user")).password("{noop}" + usr.get("pass"))
                        .roles((String) usr.get("role"));
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
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

    private boolean saveUsersToFile(String path, JSONObject jsonObject) {
        try (FileWriter file = new FileWriter(ResourceUtils.getFile("classpath:users.json"))) {

            file.write(jsonObject.toJSONString());
            file.flush();

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
