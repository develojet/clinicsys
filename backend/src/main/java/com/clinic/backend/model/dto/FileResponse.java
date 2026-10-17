package com.clinic.backend.model.dto;

public class FileResponse {
    private String url;

    public FileResponse() {
    }

    public FileResponse(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}