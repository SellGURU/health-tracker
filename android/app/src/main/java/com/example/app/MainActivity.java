package com.example.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

import sdk.sahha.android.source.Sahha;
import sdk.sahha.android.source.SahhaEnvironment;
import sdk.sahha.android.source.SahhaSettings;
import sdk.sahha.android.source.SahhaFramework;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String appId = "BF9yybnbq44AreyJf04tNbvBCXXRIFJH";
        String appSecret = "YFhSuGe4CuY13XZZzW0dGqowfM6oMNSwz9qkQBiyCxm8FneNGncwuQU7YkU50sMp";
        String externalId = "TestApp-123"; // شناسه دلخواه کاربر

        SahhaSettings settings = new SahhaSettings(
            SahhaEnvironment.sandbox, // محیط (sandbox / production / development)
            null,                     // notification config اختیاریه
            SahhaFramework.capacitor  // چون پروژه‌ات Capacitor هست
        );


        Sahha.INSTANCE.configure(this, settings, (error, success) -> {
            if (error != null) {
                System.out.println("Sahha config error: " + error);
            } else {
                System.out.println("Sahha configured successfully: " + success);

                // Authenticate بعد از configure
                Sahha.INSTANCE.authenticate(
                    appId,
                    appSecret,
                    externalId,
                    (authError, authSuccess) -> {
                        if (authSuccess) {
                            System.out.println("Authentication successful");
                        } else {
                            System.out.println("Authentication failed: " + authError);
                        }
                        return null;
                    }
                );
            }
            return null;
        });

    }
}
