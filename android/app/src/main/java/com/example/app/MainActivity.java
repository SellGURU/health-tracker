package com.example.app;
import com.yourcompany.plugins.SahhaPlugin;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(SahhaPlugin.class);
    }    
}
