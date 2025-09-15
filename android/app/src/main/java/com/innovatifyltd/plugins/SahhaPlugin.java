package com.example.plugins;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

import sdk.sahha.android.source.*;

@CapacitorPlugin(name = "SahhaPlugin")
public class SahhaPlugin extends Plugin {

    public void authenticate(PluginCall call) {
        String appId = call.getString("appId");
        String appSecret = call.getString("appSecret");
        String externalId = call.getString("externalId");

        if (appId == null || appSecret == null || externalId == null) {
            call.reject("appId, appSecret and externalId are required");
            return;
        }

        SahhaSettings settings = new SahhaSettings(
            SahhaEnvironment.sandbox, // یا production
            null,
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