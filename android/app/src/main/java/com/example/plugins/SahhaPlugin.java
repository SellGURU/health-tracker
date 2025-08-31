package com.yourcompany.plugins;

import com.getcapacitor.*;
import io.sahha.sdk.Sahha;
import io.sahha.sdk.HealthData;
import android.util.Log;

@NativePlugin
public class SahhaPlugin extends Plugin {

    @PluginMethod
    public void connect(PluginCall call) {
        Sahha.getHealthData(
            new Sahha.DataCallback() {
                @Override
                public void onSuccess(HealthData data) {
                    JSObject ret = new JSObject();
                    ret.put("heartRate", data.getHeartRate());
                    ret.put("steps", data.getSteps());
                    call.resolve(ret);
                }

                @Override
                public void onError(Exception e) {
                    call.reject(e.getMessage());
                }
            }
        );
    }
    @PluginMethod
    public void initialize(PluginCall call) {
        String appId = call.getString("appId");
        String appSecret = call.getString("appSecret");
        String env = call.getString("env");

        if (appId == null || appSecret == null) {
            call.reject("appId and appSecret are required");
            return;
        }

        Sahha.Environment environment = "PRODUCTION".equalsIgnoreCase(env)
                ? Sahha.Environment.PRODUCTION
                : Sahha.Environment.DEVELOPMENT;

        try {
            Sahha.initialize(
                getContext(),
                appId,
                appSecret,
                new Sahha.Config.Builder()
                    .setEnvironment(environment)
                    .build(),
                new Sahha.Callback() {
                    @Override
                    public void onSuccess() {
                        call.resolve();
                    }

                    @Override
                    public void onError(Exception e) {
                        call.reject(e.getMessage());
                    }
                }
            );
        } catch (Exception e) {
            call.reject("Initialization failed: " + e.getMessage());
        }
    }

}