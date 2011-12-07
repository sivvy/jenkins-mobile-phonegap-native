package com.jenkins.android;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.TableRow;
import android.widget.TextView;

import com.jenkins.*;
import com.phonegap.*;

public class JenkinsAndroidNativeActivity extends DroidGap {
    /** Called when the activity is first created. */
	WebView myWebView;
	TextView title;
	TableRow rowDefault, rowSettings;
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        super.init();
        setContentView(R.layout.main);
        myWebView = (WebView) findViewById(R.id.phonegap_container);
        myWebView.setWebChromeClient(new WebChromeClient()); 
        myWebView.setWebViewClient(new WebViewClient()); 
        myWebView.getSettings().setJavaScriptEnabled(true);
        View html = (View)super.appView.getParent();
        myWebView.addView(html);
        super.loadUrl("file:///android_asset/www/index.html");
        
        title = (TextView) findViewById(R.id.app_title);
        rowDefault = (TableRow) findViewById(R.id.icon_row_default);
        rowSettings = (TableRow) findViewById(R.id.icon_row_settings);
        rowSettings.setVisibility(View.GONE);
        
        ImageView home = (ImageView) findViewById(R.id.home);
        ImageView refresh = (ImageView) findViewById(R.id.refresh);
        ImageView settings = (ImageView) findViewById(R.id.settings);
        ImageView quit = (ImageView) findViewById(R.id.quit);
        
        ImageView backButton = (ImageView) findViewById(R.id.done);
        ImageView addButton = (ImageView) findViewById(R.id.add);
        
        home.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				sendJavascript("homeClickEvent()");
			}
		});
        
        refresh.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View v) {
        		sendJavascript("refreshClickEvent()");
        	}
        } );
        
        settings.setOnClickListener(new View.OnClickListener() {
    	   public void onClick(View v) {
     		   title.setText("Settings");
     		   rowDefault.setVisibility(View.GONE);
     		   rowSettings.setVisibility(View.VISIBLE);
    		   sendJavascript("settingClickEvent()");
    	   }
      	} );
        
        backButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				title.setText("Servers");
				rowDefault.setVisibility(View.VISIBLE);
				rowSettings.setVisibility(View.GONE);
				sendJavascript("backClickEvent()");
			}
		});
        
        addButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				sendJavascript("addClickEvent()");
			}
		});
        
        quit.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View v) {
        		sendJavascript("quitClickEvent()");
        	}
        } );
    }
}