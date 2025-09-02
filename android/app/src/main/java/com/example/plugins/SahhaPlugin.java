package com.example.plugins;

import com.getcapacitor.*;
import android.util.Log;
import sdk.sahha.android.source.*;

@NativePlugin
public class SahhaPlugin extends Plugin {

    @PluginMethod
    public void authenticate(PluginCall call) {
        String appId = call.getString("appId");
        String appSecret = call.getString("appSecret");
        String externalId = call.getString("externalId");

        if (appId == null || appSecret == null || externalId == null) {
            call.reject("appId, appSecret and externalId are required");
            return;
        }

        // تنظیمات Sahha
        SahhaSettings settings = new SahhaSettings(
            SahhaEnvironment.sandbox, // میتونی param هم بذاری
            null,                     // Notification اختیاری
            SahhaFramework.capacitor
        );

        Sahha.INSTANCE.configure(getActivity(), settings, (error, success) -> {
            if (error != null) {
                call.reject("Sahha configure error: " + error);
                return null;
            }

            Sahha.INSTANCE.authenticate(
                appId,
                appSecret,
                externalId,
                (authError, authSuccess) -> {
                    if (authSuccess) {
                        JSObject ret = new JSObject();
                        ret.put("success", true);
                        call.resolve(ret);
                    } else {
                        call.reject("Authentication failed: " + authError);
                    }
                    return null;
                }
            );
            return null;
        });
    }
}
