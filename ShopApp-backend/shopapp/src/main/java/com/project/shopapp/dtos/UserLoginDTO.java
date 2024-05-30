package com.project.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserLoginDTO {
    @JsonProperty("phone_number")
    @NotBlank(message = "Bạn phải nhập số điện thoại!")
    private String phoneNumber;


    @NotBlank(message = "Bạn phải nhập mật khẩu!")
    private String password;
}
