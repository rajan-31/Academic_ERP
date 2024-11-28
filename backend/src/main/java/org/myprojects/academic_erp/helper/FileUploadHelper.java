package org.myprojects.academic_erp.helper;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

@Component
public class FileUploadHelper {
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/static";
    private static final String IMAGE_UPLOAD_PATH = "/uploads/images/";

    public String savePhotograph(MultipartFile photograph, String rollNumber) {
        try {
            File uploadDir = new File(UPLOAD_DIR+IMAGE_UPLOAD_PATH);
            if (!uploadDir.exists()) {
                if(!uploadDir.mkdirs())
                    throw new RuntimeException("Unable to create directory");
            }

            String fileExtension = Objects.requireNonNull(
                    photograph.getOriginalFilename())
                    .substring(photograph.getOriginalFilename()
                            .lastIndexOf(".")
                    );
            String relativeFilePath = IMAGE_UPLOAD_PATH + rollNumber + fileExtension;

            String absoluteFilePath = UPLOAD_DIR + relativeFilePath;
            photograph.transferTo(new File(absoluteFilePath));

            return relativeFilePath;
        } catch (IOException e) {
            throw new RuntimeException("Error saving photograph: " + e.getMessage(), e);
        }
    }

    public boolean deletePhotograph(String photographPath) {
        File file = new File(UPLOAD_DIR + photographPath);
        if (file.exists()) {
            return file.delete();
        }
        return false;
    }
}
