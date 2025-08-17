package com.example.kapehan;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Delay loading the WebView until after we check internet
        super.onCreate(savedInstanceState);
        checkInternetBeforeLoading();
    }

    private void checkInternetBeforeLoading() {
        new Thread(() -> {
            boolean isConnected = isInternetAvailable();

            runOnUiThread(() -> {
                if (isConnected) {
                    // Proceed to load the web app
                    load();
                } else {
                    showNoInternetDialog();
                }
            });
        }).start();
    }

    private boolean isInternetAvailable() {
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress("8.8.8.8", 53), 1500);
            socket.close();
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private void showNoInternetDialog() {
        new AlertDialog.Builder(this)
                .setTitle("No Internet Connection")
                .setMessage("Please connect to the internet to continue.")
                .setCancelable(false)
                .setPositiveButton("Retry", (dialog, which) -> checkInternetBeforeLoading())
                .setNegativeButton("Exit", (dialog, which) -> finish())
                .show();
    }
}
