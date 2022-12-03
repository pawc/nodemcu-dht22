#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "DHT.h"
 
// EDIT START
#define DHTPIN 4          // numer pinu sygnałowego
#define DHTTYPE DHT22     // typ czujnika (DHT11). Jesli posiadamy DHT22 wybieramy DHT22
const char* ssid = "";
const char* password = "";
const char* apiPass = "";
const char* serverName = "http://pawc.pl:8080/pawc";
const int setupDelay = 5000;
const int loopDelay = 60000;
// EDIT END

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to "+String(setupDelay)+" ms before publishing first reading.");

  delay(setupDelay);
  dht.begin();
}

void loop() {

    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      
      float t = dht.readTemperature();
      float h = dht.readHumidity();

      if(isnan(t)) t = 0;
      if(isnan(h)) h = 0;

      if(!isnan(t) || !isnan(h)){
        String odczyt = ", T: " + String(t) + ", H: " + String(h);
        http.begin(client, serverName);
        http.addHeader("Content-Type", "application/x-www-form-urlencoded");
        String httpRequestData = "t="+String(t)+"&h="+String(h)+"&pass="+apiPass;
        int httpResponseCode = http.POST(httpRequestData);
        Serial.println("HTTP " + String(httpResponseCode) + odczyt);
        http.end();
      }
      else{
        Serial.println("Nieprawidłowe odczyty z czujnika");
      }

    }
    else {
      Serial.println("WiFi Disconnected");
    }

    delay(loopDelay);
  
}