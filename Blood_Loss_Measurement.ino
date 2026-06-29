#include <Wire.h>
#include <Adafruit_AS7343.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// --- Network & MQTT Settings ---
const char* ssid = "SSID";
const char* password = "PASSWORD";

const char* mqtt_server = "broker.emqx.io";
const int mqtt_port = 8883; // MQTT over TLS/SSL
const char* mqtt_user = "";
const char* mqtt_pass = "";

WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
const unsigned long PUBLISH_INTERVAL_MS = 1000; // Publish rate

Adafruit_AS7343 as7343;

#define NUM_SAMPLES 5

// ===== TANK PARAMETERS (EDIT THESE) =====
#define TANK_HEIGHT_CM 30.0
#define TANK_RADIUS_CM 4.0

// Function Prototypes
void setup_wifi();
void reconnect();

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  // Setup WiFi and MQTT
  setup_wifi();
  espClient.setInsecure(); // Bypass SSL certificate validation for simplicity
  client.setServer(mqtt_server, mqtt_port);

  // AS7343 init
  if (!as7343.begin()) {
    Serial.println("AS7343 not found!");
    while (1);
  }

  as7343.setGain(AS7343_GAIN_64X);
  as7343.setATIME(29);
  as7343.setASTEP(599);
  as7343.setSMUXMode(AS7343_SMUX_18CH);

  Serial.println("System Ready...");
}

void loop() {
  // MQTT Connection Keep-Alive
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > PUBLISH_INTERVAL_MS) {
    lastMsg = now;

    uint16_t readings[18];
    float avgFXL = 0, avgF5 = 0, avgNIR = 0;

    // ===== AVERAGING =====
    for (int i = 0; i < NUM_SAMPLES; i++) {
      if (as7343.readAllChannels(readings)) {
        avgFXL += readings[AS7343_CHANNEL_FXL];
        avgF5  += readings[AS7343_CHANNEL_F5];
        avgNIR += readings[AS7343_CHANNEL_NIR];
      }
      delay(10);
    }

    avgFXL /= NUM_SAMPLES;
    avgF5  /= NUM_SAMPLES;
    avgNIR /= NUM_SAMPLES;

    // ===== BLOOD % (600nm method) =====
    float fxl = avgFXL;
    float bloodPercent = 0.0;

    if (fxl >= 20 && fxl <= 35) {
      bloodPercent = 100.0;
    } else if (fxl > 35 && fxl <= 45) {
      bloodPercent = 50.0;
    } else if (fxl >= 50 && fxl <= 62) {
      bloodPercent = 50.0;
    } else {
      bloodPercent = 0.0;
    }

    // ===== VOLUME CALCULATION =====
    // User requested: total fluid is constant 100ml
    float volume_ml = 100.0;

    // ===== BLOOD VOLUME =====
    float bloodVolume = volume_ml * (bloodPercent / 100.0);

    // ===== OUTPUT =====
    Serial.println("----- SYSTEM OUTPUT -----");

    Serial.print("600nm (FXL): ");
    Serial.println(avgFXL);

    Serial.print("Blood %: ");
    Serial.print(bloodPercent);
    Serial.println(" %");

    Serial.print("Total Volume: ");
    Serial.print(volume_ml);
    Serial.println(" ml");

    Serial.print("Blood Volume: ");
    Serial.print(bloodVolume);
    Serial.println(" ml");

    Serial.println("--------------------------\n");

    // ===== MQTT PUBLISH =====
    // Create JSON payload to send to the dashboard
    String payload = "{";
    payload += "\"blood_vol\":" + String(bloodVolume, 1) + ",";
    payload += "\"total_vol\":" + String(volume_ml, 1) + ",";
    payload += "\"blood_percent\":" + String(bloodPercent, 1);
    payload += "}";

    client.publish("medical/blood_loss/data", payload.c_str());
  }
}

// ===== WIFI SETUP FUNCTION =====
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ===== MQTT RECONNECT FUNCTION =====
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID to avoid collisions
    String clientId = "ESP32Client-BloodLoss-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("connected to EMQX!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" trying again in 5 seconds");
      
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
