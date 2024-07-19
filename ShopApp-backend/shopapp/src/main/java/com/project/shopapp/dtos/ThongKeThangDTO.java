package com.project.shopapp.dtos;

import lombok.*;

@Data
@NoArgsConstructor
public class ThongKeThangDTO extends ThongKeDTO {
    private String month;

    @Builder
    public ThongKeThangDTO(String month, double totalMoney, Integer numberOfProducts) {
        super(totalMoney, numberOfProducts);
        this.month = month;
    }
}

