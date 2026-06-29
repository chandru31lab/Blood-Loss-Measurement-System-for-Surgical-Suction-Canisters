Based on your uploaded files, the project consists of an **ESP32-based Blood Loss Measurement System** that uses the **Adafruit AS7343 spectral sensor**, publishes blood loss data over **MQTT**, and includes a **React + Vite dashboard** for visualization.  

You can replace your existing `README.md` with the following:

---

# 🩸 Blood Loss Measurement System

An IoT-based Blood Loss Measurement System designed to estimate blood loss during surgical procedures using the **AS7343 Spectral Sensor** and an **ESP32**. The measured data is transmitted securely via **MQTT** and visualized on a real-time **React Dashboard**.

## 📌 Overview

This project continuously monitors the spectral characteristics of collected fluid to estimate the percentage and volume of blood present. The ESP32 processes sensor data, calculates blood loss, and publishes the results to an MQTT broker. A React-based dashboard subscribes to the MQTT topic and displays live measurements.

## ✨ Features

* Real-time blood loss estimation
* AS7343 spectral sensor integration
* ESP32-based data acquisition
* MQTT communication for live data transfer
* React + Vite web dashboard
* Continuous monitoring with automatic updates
* JSON-based data exchange
* Modular and scalable architecture

## 🛠️ Hardware Used

* ESP32 Development Board
* Adafruit AS7343 18-Channel Spectral Sensor
* Wi-Fi Network
* Power Supply

## 💻 Software & Technologies

* Arduino IDE
* C++
* React.js
* Vite
* MQTT
* Node.js
* JavaScript

## 📂 Project Structure

```text
Blood_Loss_Measurement/
│── Blood_Loss_Measurement.ino     # ESP32 firmware
│── dashboard/                     # React Dashboard
│── mqtt_test.js                   # MQTT testing client
│── package.json
│── vite.config.js
│── README.md
```

## ⚙️ Working Principle

1. The AS7343 captures spectral data from the collected fluid.
2. The ESP32 averages multiple sensor readings for improved accuracy.
3. Blood percentage is estimated using predefined wavelength thresholds.
4. Blood volume is calculated based on the measured percentage.
5. The data is packaged as a JSON object.
6. The ESP32 publishes the data to an MQTT broker.
7. The React dashboard subscribes to the MQTT topic and displays live values.

## 📡 MQTT Data Format

```json
{
  "blood_vol": 50.0,
  "total_vol": 100.0,
  "blood_percent": 50.0
}
```

## 🚀 Getting Started

### ESP32 Firmware

1. Open `Blood_Loss_Measurement.ino` in Arduino IDE.
2. Install the required libraries:

   * Adafruit AS7343
   * PubSubClient
   * WiFi
3. Configure:

   * Wi-Fi SSID
   * Wi-Fi Password
   * MQTT Broker
4. Upload the code to the ESP32.

### Dashboard

```bash
npm install
npm run dev
```

The dashboard will be available at:

```
http://localhost:5173
```

## 📊 Output

The system provides:

* Blood Percentage (%)
* Total Fluid Volume (mL)
* Estimated Blood Volume (mL)
* Live Dashboard Visualization

## 🔮 Future Improvements

* Machine Learning-based blood estimation
* Cloud database integration
* Historical trend analysis
* Alarm notifications for excessive blood loss
* Mobile application support
* Patient record management

## 👨‍💻 Author

**Ramachandru J**

B.Tech Electronics and Communication Engineering
SRM Institute of Science and Technology

---

This project was developed as an IoT-based medical monitoring solution for real-time blood loss estimation using spectral sensing and wireless communication.  
