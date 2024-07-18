package com.project.shopapp.dtos;

public class MonthlySalesDTO {
    private int month;
    private double totalRevenue;
    private int totalProductsSold;

    // Constructors, getters, and setters
    public MonthlySalesDTO(int month, double totalRevenue, int totalProductsSold) {
        this.month = month;
        this.totalRevenue = totalRevenue;
        this.totalProductsSold = totalProductsSold;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getTotalProductsSold() {
        return totalProductsSold;
    }

    public void setTotalProductsSold(int totalProductsSold) {
        this.totalProductsSold = totalProductsSold;
    }
}
