package com.jenkins.android;

import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import com.jenkins.*;
import com.phonegap.*;

public class JenkinsAndroidActivity extends DroidGap {
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
//        myWebView.getSettings().setDomStorageEnabled(true);
        View html = (View)super.appView.getParent();
        myWebView.addView(html);
//        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
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
	    		   Context context = getApplicationContext();
	    		   Toast.makeText(context, "Home! ", Toast.LENGTH_SHORT).show();
				sendJavascript("homeClickEvent()");
//				JenkinsAndroidActivity.super.loadUrl("javascript:homeClickEvent()");
			}
		});
        
        refresh.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View v) {
     		   Context context = getApplicationContext();
     		   Toast.makeText(context, "Refresh! ", Toast.LENGTH_SHORT).show();
        		sendJavascript("refreshClickEvent()");
//        		JenkinsAndroidActivity.super.cancelLoadUrl();
//        		JenkinsAndroidActivity.super.sendJavascript();
//        		this.ctx.sendJavascript("");
//        		JenkinsAndroidActivity.super.loadUrl("javascript:refreshClickEvent()");
        	}
        } );
        
        settings.setOnClickListener(new View.OnClickListener() {
    	   public void onClick(View v) {
    		   Context context = getApplicationContext();
    		   Toast.makeText(context, "Settings! ", Toast.LENGTH_SHORT).show();
     		   title.setText("Settings");
     		   rowDefault.setVisibility(View.GONE);
     		   rowSettings.setVisibility(View.VISIBLE);
//    		   loadUrl("http://www.google.com.my");
    		   //JenkinsAndroidActivity.super.cancelLoadUrl();
//    		   sendJavascript("document.getElementsByTagName('div')[0].style.backgroundColor='red';");
    		   sendJavascript("settingClickEvent()");
//    		   JenkinsAndroidActivity.super.loadUrl("javascript:alert('No JavaScript')");
//    		   JenkinsAndroidActivity.super.loadUrl("javascript:settingClickEvent()");
    	   }
      	} );
        
        backButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				Context context = getApplicationContext();
				Toast.makeText(context, "Back! ", Toast.LENGTH_SHORT).show();
				title.setText("Servers");
				rowDefault.setVisibility(View.VISIBLE);
				rowSettings.setVisibility(View.GONE);
				sendJavascript("backClickEvent()");
			}
		});
        
        addButton.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				Context context = getApplicationContext();
				Toast.makeText(context, "New! ", Toast.LENGTH_SHORT).show();
				sendJavascript("addClickEvent()");
			}
		});
        
        quit.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View v) {
     		   Context context = getApplicationContext();
     		   Toast.makeText(context, "Quit! ", Toast.LENGTH_SHORT).show();
        		sendJavascript("quitClickEvent()");
//        		JenkinsAndroidActivity.super.loadUrl("javascript:quitClickEvent()");
        	}
        } );
    }
}