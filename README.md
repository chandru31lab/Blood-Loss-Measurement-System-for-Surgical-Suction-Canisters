# Real-Time Blood Loss Measurement System for Surgical Suction Canisters

> **An embedded optical sensing system designed to estimate blood concentration and total fluid volume in surgical suction canisters, enabling real-time estimation of blood loss from mixed surgical fluids.**

![Platform](https://img.shields.io/badge/Platform-ESP32-blue)
![Optical Sensing](https://img.shields.io/badge/Sensing-Optical%20Spectroscopy-orange)
![Spectral Sensor](https://img.shields.io/badge/Sensor-AS7343-purple)
![Distance Sensor](https://img.shields.io/badge/Level%20Sensing-VL53L0X-green)
![Language](https://img.shields.io/badge/Language-C%2FC%2B%2B-red)
![Application](https://img.shields.io/badge/Application-MedTech-critical)
![Status](https://img.shields.io/badge/Status-Prototype-yellow)

---

## 📌 Overview

The **Real-Time Blood Loss Measurement System** is a healthcare-focused embedded system designed to address the challenge of estimating blood loss during surgical procedures.

The project originated from discussions with medical professionals at **SRM Global Hospital, Kattankulathur**, where we studied the existing blood-loss estimation workflow used in operation theatres.

During surgery, blood is commonly collected through a suction system into a **suction canister**. However, the collected material is not pure blood. It can contain:

* 🩸 Blood
* 💧 Saline
* 🧪 Irrigation fluids
* 🧬 Other body fluids
* 🫧 Foam and air bubbles
* Other fluids introduced during the procedure

Because of this mixture, simply reading the total volume inside the suction canister does not provide the actual blood loss.

The project therefore investigates a two-parameter approach:

```text
Blood Concentration
        +
Total Fluid Volume
        ↓
Estimated Blood Volume
```

The system combines **optical spectral sensing**, **liquid-level measurement**, and **embedded real-time processing**.

---

# 🎯 Problem Statement

Accurate estimation of blood loss during surgery is important for clinical decision-making.

Current estimation methods may include:

### 1. Surgical Pad Estimation

Doctors estimate blood absorbed by surgical pads based on the number and type of pads used.

A pad can absorb a significant amount of fluid, but its actual blood content can vary depending on:

* Blood concentration
* Saline usage
* Other fluids
* Degree of saturation
* Handling and weighing/visual estimation methods

### 2. Suction Canister Estimation

The suction system collects fluid in a canister.

However:

```text
Total Canister Volume
≠
Blood Volume
```

because:

```text
Blood + Saline + Body Fluids + Irrigation Fluids
```

may all be present simultaneously.

Therefore, the project aims to estimate:

> **How much of the collected fluid is actually blood?**

---

# 💡 Proposed Solution

The system separates the problem into two measurements:

### Measurement 1 — Blood Concentration

Use an optical spectral sensor to analyze the optical response of the collected fluid.

### Measurement 2 — Total Fluid Volume

Use a distance/level sensor to estimate the amount of fluid present in the suction canister.

The two measurements are then combined to estimate blood volume.

```text
          ┌─────────────────────────┐
          │   Surgical Canister     │
          │                         │
          │ Blood + Saline +        │
          │ Other Fluids            │
          └───────────┬─────────────┘
                      │
            ┌─────────┴─────────┐
            │                   │
            ▼                   ▼
     Optical Sensing       Level Sensing
       AS7343              VL53L0X
            │                   │
            ▼                   ▼
   Blood Concentration      Fluid Volume
            │                   │
            └─────────┬─────────┘
                      ▼
              ESP32 Processing
                      │
                      ▼
              Blood Loss (mL)
```

---

# 🏗️ System Architecture

```text
                    REAL-TIME BLOOD LOSS
                       MEASUREMENT
                            │
                            ▼
                ┌───────────────────────┐
                │    SUCTION CANISTER   │
                │                       │
                │ Blood + Saline +      │
                │ Body Fluids           │
                └───────────┬───────────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
     ┌────────────────┐          ┌─────────────────┐
     │ Optical Module │          │ Level Measurement│
     │                │          │                 │
     │ AS7343         │          │ VL53L0X ToF     │
     │ Spectrometer   │          │ Sensor          │
     └───────┬────────┘          └────────┬────────┘
             │                            │
             │ Spectral Data              │ Distance
             ▼                            ▼
        ┌─────────────────────────────────────┐
        │                ESP32                │
        │                                     │
        │ • Sensor Acquisition                │
        │ • Filtering                         │
        │ • Calibration                       │
        │ • Blood Concentration Estimation    │
        │ • Fluid Volume Calculation          │
        │ • Blood Volume Calculation           │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │ Real-Time Display   │
                 │                     │
                 │ Total Fluid: XXX mL │
                 │ Blood: XX %         │
                 │ Blood Loss: XXX mL  │
                 └─────────────────────┘
```

---

# 🔬 Core Working Principle

The project uses two independent sensing mechanisms.

## 1. Optical Blood Concentration Measurement

Blood contains hemoglobin, which has wavelength-dependent optical absorption characteristics.

The AS7343 multi-channel spectral sensor provides measurements across multiple wavelength bands.

The prototype evaluates channels including:

```text
550 nm
600 nm
855 nm / NIR
```

The optical system illuminates the sample and measures the resulting spectral response.

The measured response is then correlated with known blood concentrations through calibration.

---

## 2. Total Fluid Volume Measurement

The VL53L0X Time-of-Flight sensor is used to measure the distance between the sensor and the liquid surface.

Conceptually:

```text
Sensor
   │
   │ Distance
   ▼
────────────── Liquid Surface
██████████████
██████████████
██████████████
```

If the canister reference height is known:

```text
Liquid Height =
Reference Height − Measured Distance
```

The liquid height is then converted into volume using the calibrated geometry of the canister.

---

# 🧮 Blood Volume Estimation

The conceptual calculation is:

```text
Blood Volume = Total Fluid Volume × Blood Concentration
```

For example:

```text
Total Fluid Volume = 200 mL
Estimated Blood Concentration = 50%

Estimated Blood Volume =
200 × 0.50

= 100 mL
```

> **Important:** This equation is the prototype's estimation model. Clinical blood-loss measurement requires validation against an accepted reference method and must account for the complex composition of surgical suction fluid.

---

# 🔬 Optical Sensing

## AS7343 Multi-Spectral Sensor

The prototype uses the **AS7343** to capture multi-channel spectral information.

Relevant channels investigated include:

| Channel | Approx. Wavelength | Purpose                          |
| ------- | -----------------: | -------------------------------- |
| F5      |             550 nm | Visible absorption response      |
| FXL     |             600 nm | Blood-related optical response   |
| NIR     |             855 nm | Near-infrared/reference response |

The system can acquire multiple spectral channels simultaneously.

---

# 💡 Illumination System

The optical module requires controlled illumination.

Initial experiments were performed using:

* 1 W white LED
* Higher-power LED illumination
* DC-controlled illumination

A major challenge was observed during testing with real blood.

## Initial Transmission Experiment

The first design attempted:

```text
LED → Blood → AS7343
```

across a relatively large distance.

However, whole blood produced strong optical attenuation due to absorption and scattering.

The result was:

```text
1 W LED
      ↓
    BLOOD
      ↓
Very little detectable light
```

Increasing LED power improved the detectable signal, but simply increasing illumination is not considered a sufficient solution for a reliable measurement architecture.

---

# 🔬 Optical Path Optimization

The project therefore investigates shorter optical paths and alternative optical geometries.

## Approach 1 — Thin Optical Path

A small optical chamber can reduce the distance that light must travel through blood.

```text
LED
 │
 ▼
┌───────────────┐
│               │
│  2–4 mm       │
│  Blood Path   │
│               │
└───────────────┘
        │
        ▼
      AS7343
```

The reduced optical path improves the amount of measurable transmitted light.

---

## Approach 2 — Reflectance Measurement

Instead of requiring light to pass completely through the blood:

```text
        LED
         │
         ▼
      ↘ Blood ↙
          ↑
          │
       Sensor
```

The system can investigate reflected and scattered light.

This is particularly relevant for highly turbid samples where transmission becomes difficult.

---

# 🌈 NIR Investigation

Near-infrared illumination is being investigated as an additional optical channel.

A possible architecture is:

```text
Visible LED
     ↓
Visible spectral response

       +

NIR LED
     ↓
NIR reference response
```

The NIR measurement can potentially be used as a reference for compensating illumination and scattering effects.

However, NIR alone is not treated as a direct blood-volume measurement.

---

# 🧪 Calibration

Calibration is a critical component of the project.

The system is tested using known blood-to-fluid mixtures.

Example calibration levels:

```text
0% Blood
25% Blood
50% Blood
75% Blood
100% Blood
```

For a 200 mL calibration sample:

| Blood Concentration |  Blood |  Fluid |  Total |
| ------------------: | -----: | -----: | -----: |
|                  0% |   0 mL | 200 mL | 200 mL |
|                 25% |  50 mL | 150 mL | 200 mL |
|                 50% | 100 mL | 100 mL | 200 mL |
|                 75% | 150 mL |  50 mL | 200 mL |
|                100% | 200 mL |   0 mL | 200 mL |

The optical sensor response is recorded for each known concentration.

This produces a calibration relationship:

```text
Sensor Response
       ↓
Calibration Model
       ↓
Estimated Blood Concentration
```

---

# 🧪 Real Sample Testing

Unlike a purely simulated project, the prototype has been evaluated using **real blood samples and fluid samples obtained through the hospital collaboration**.

Testing focuses on understanding:

* Spectral response of real blood
* Effect of dilution
* Optical attenuation
* Sensor response at different concentrations
* Effect of fluid mixtures
* Repeatability
* Practical optical geometry

All real-sample handling must follow appropriate hospital/laboratory biosafety procedures.

---

# 📊 Spectral Processing

The ESP32 acquires AS7343 measurements and performs basic signal processing.

The prototype includes:

* Multi-channel acquisition
* Sample averaging
* Range limiting
* Calibration mapping
* Real-time blood percentage estimation

Example processing:

```text
AS7343
   ↓
Multiple Measurements
   ↓
Averaging
   ↓
Selected Spectral Channel
   ↓
Calibration Mapping
   ↓
Blood Concentration (%)
```

---

# 📈 Prototype Calibration Example

During initial experimentation, the 600 nm channel was investigated as a simple indicator.

Observed prototype relationship:

```text
600 nm reading ≈ 60–70
        ↓
High blood concentration

600 nm reading ≈ 120
        ↓
Lower blood concentration
```

A preliminary linear mapping was implemented for experimentation.

> These values are **prototype-specific calibration observations**, not clinically validated blood-concentration standards. Final calibration must be established from a statistically sufficient dataset and compared against an accepted reference measurement method.

---

# 🧠 Embedded Processing

The ESP32 acts as the central processing unit.

Its responsibilities include:

```text
AS7343
   │
   ├── 550 nm
   ├── 600 nm
   ├── NIR
   └── Other Spectral Channels
          │
          ▼
       ESP32
          │
          ├── Filtering
          ├── Averaging
          ├── Calibration
          └── Blood %
          
VL53L0X
   │
   ▼
Distance
   │
   ▼
Liquid Height
   │
   ▼
Total Volume
```

The two measurements are then combined.

---

# 📏 Liquid-Level Measurement

The prototype uses the **VL53L0X Time-of-Flight sensor** for liquid-level measurement.

The sensor is positioned above the liquid surface.

```text
       VL53L0X
          │
          │
          │ Distance
          ▼
────────────────────
     Fluid Surface
~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~
```

The sensor does not need to be immersed in the fluid.

However, the final mechanical design must protect the optical sensor from:

* Blood droplets
* Condensation
* Foam
* Splashing
* Contamination

A protected optical window and suitable enclosure can be investigated for this purpose.

---

# 🛡️ Sensor Protection

For a hospital-oriented design, the sensing electronics should not be directly exposed to the collected fluid.

Potential mechanical protection includes:

```text
             SENSOR
                │
        ┌───────┴───────┐
        │ Optical Window│
        └───────┬───────┘
                │
              Air Gap
                │
        ─────────────────
             Fluid
```

The final design should prioritize:

* Sealing
* Cleanability
* Disposable interfaces where appropriate
* Optical transparency
* Splash protection
* Electrical isolation

---

# ⚙️ Hardware Components

| Component         | Purpose                           |
| ----------------- | --------------------------------- |
| ESP32             | Main processing/controller        |
| AS7343            | Multi-spectral optical sensing    |
| VL53L0X           | Liquid-level/distance measurement |
| White LED         | Optical illumination              |
| NIR LED           | Optional reference illumination   |
| Suction Canister  | Fluid collection container        |
| Optical Chamber   | Short optical-path measurement    |
| MOSFET/LED Driver | Controlled illumination           |
| Display           | Real-time output                  |
| Power Supply      | System power                      |

---

# 🔌 Communication

The main sensors communicate with the ESP32 through I²C.

```text
                ESP32
               /     \
              /       \
             ▼         ▼
          AS7343     VL53L0X
         I²C Bus      I²C Bus
```

This allows the controller to acquire both:

```text
Spectral Data
+
Distance Data
```

using a common embedded platform.

---

# 💻 Software

## Development Environment

```text
Arduino IDE
ESP32 Arduino Core
C/C++
```

## Libraries

The prototype uses libraries including:

```cpp
#include <Wire.h>
#include <Adafruit_AS7343.h>
#include <Adafruit_VL53L0X.h>
```

---

# 🧩 Firmware Architecture

The firmware is organized around several functional blocks:

```text
setup()
   │
   ├── Initialize I²C
   ├── Initialize AS7343
   ├── Initialize VL53L0X
   └── Configure Sensors
          │
          ▼
        loop()
          │
          ├── Read Spectral Data
          │
          ├── Average Samples
          │
          ├── Calculate Blood %
          │
          ├── Read ToF Distance
          │
          ├── Calculate Fluid Level
          │
          ├── Calculate Fluid Volume
          │
          └── Estimate Blood Volume
```

---

# 📊 Example Output

The prototype can generate real-time values such as:

```text
----- SYSTEM OUTPUT -----

600nm (FXL): 82

550nm (F5): 145
NIR (855nm): 210

Blood %: 76 %

Distance: 12.4 cm
Liquid Height: 17.6 cm

Total Volume: XXX ml
Blood Volume: XXX ml

--------------------------
```

---

# 🔄 Real-Time Measurement Workflow

```text
        Start
          │
          ▼
     Initialize ESP32
          │
          ▼
     Initialize AS7343
          │
          ▼
     Initialize VL53L0X
          │
          ▼
    Read Spectral Data
          │
          ▼
      Filter/Average
          │
          ▼
 Estimate Blood Concentration
          │
          ▼
      Read Liquid Level
          │
          ▼
    Calculate Fluid Volume
          │
          ▼
 Combine Concentration + Volume
          │
          ▼
   Estimate Blood Volume
          │
          ▼
      Display Result
          │
          └──────────► Repeat
```

---

# 🧪 Testing Strategy

The prototype should be evaluated under controlled conditions.

### Test 1 — No Blood

```text
0% Blood
```

Establish optical baseline.

### Test 2 — Low Blood Concentration

```text
25% Blood
```

Measure spectral response.

### Test 3 — Medium Concentration

```text
50% Blood
```

Evaluate response curve.

### Test 4 — High Concentration

```text
75% Blood
```

Evaluate optical attenuation.

### Test 5 — High/Undiluted Blood

```text
100% Blood
```

Determine the maximum attenuation and sensor operating range.

---

# 📐 Accuracy Validation

The final system should not rely solely on the sensor output.

A reference measurement should be used during validation.

For each test:

```text
Reference Blood Volume
        ↓
Actual Measurement

Sensor Estimated Blood Volume
        ↓
System Measurement
```

Then calculate:

```text
Absolute Error =
|Reference − Estimated|

Percentage Error =
|Reference − Estimated|
----------------------- × 100
       Reference
```

Repeated measurements should be performed to evaluate:

* Accuracy
* Precision
* Repeatability
* Drift
* Response time

---

# ⚠️ Engineering Challenges

## 1. Optical Attenuation

Whole blood strongly attenuates visible light.

### Challenge

```text
Long optical path
      ↓
High absorption + scattering
      ↓
Very low received signal
```

### Approach

Investigate:

* Shorter optical path
* Reflectance geometry
* Appropriate illumination
* Multi-wavelength sensing

---

## 2. Foam

Foam can interfere with both optical and level measurements.

Potential mitigation:

* Signal filtering
* Measurement confidence checks
* Mechanical splash/foam management
* Multiple measurements

---

## 3. Non-Uniform Mixing

Blood and saline may not remain perfectly homogeneous.

Therefore, a single optical measurement may not always represent the entire canister.

Future designs should investigate:

* Multiple sensing points
* Controlled mixing
* Time-based sampling
* Multi-channel optical measurements

---

## 4. Sensor Contamination

Blood droplets or condensation can contaminate an exposed optical sensor.

Potential solution:

```text
Sensor
 ↓
Protective Optical Window
 ↓
Air Gap
 ↓
Fluid
```

The optical window must itself be characterized because it can introduce optical losses and reflections.

---

# 🚧 Current Prototype Limitations

The current system is a **research and engineering prototype**, not a clinically certified medical device.

Current limitations include:

* Optical response depends on sample composition
* Blood/saline mixtures may not represent all surgical fluids
* Foam can affect measurements
* Non-uniform fluid composition can introduce error
* Optical windows can alter sensor readings
* Canister geometry must be calibrated
* ToF performance depends on surface conditions
* Calibration must be experimentally validated
* Clinical accuracy has not yet been established

Therefore, the current output should be considered an **experimental estimate**, not a clinical measurement.

---

# 🏥 Clinical Problem Discovery

The project was developed from a real-world clinical problem rather than a purely theoretical concept.

The team interacted with medical professionals at:

**SRM Global Hospital, Kattankulathur**

The discussions helped identify:

* Existing blood-loss estimation practices
* Challenges with suction canister measurements
* Blood + fluid mixing problems
* Practical requirements for operation-theatre use
* Importance of real-time information

This clinical interaction guided the engineering architecture.

---

# 🤝 Interdisciplinary Collaboration

The project involves collaboration between:

```text
Electronics Engineering
        +
Embedded Systems
        +
Optical Sensing
        +
Medical Knowledge
        +
Clinical Feedback
```

The team includes engineering and medical students, allowing the project to combine technical development with clinical understanding.

---

# 🏆 Presentation & Recognition

The prototype was presented at:

### **Illuminova'26**

**SRM Medical College Hospital, Kattankulathur**

The project was presented to medical professionals and institutional leadership, providing an opportunity to receive feedback from both engineering and clinical perspectives.

---

# 🌟 Key Features

* 🔬 **Multi-Spectral Optical Sensing**
* 🩸 **Blood Concentration Estimation**
* 📏 **Liquid-Level Measurement**
* ⚡ **ESP32 Real-Time Processing**
* 📊 **Calibration-Based Estimation**
* 🔄 **Real-Time Monitoring**
* 🧪 **Real Blood Sample Testing**
* 🏥 **Hospital-Driven Problem Definition**
* 🔧 **Modular Embedded Architecture**
* 📈 **Scalable Medical-Technology Platform**

---

# 🧠 Why This Project Is Different

Traditional estimation:

```text
Surgical Pads
      +
Visual Estimation
      +
Canister Volume
      ↓
Approximate Blood Loss
```

Proposed approach:

```text
Optical Spectral Measurement
              +
Liquid-Level Measurement
              ↓
      Embedded Processing
              ↓
     Blood Concentration
              +
       Fluid Volume
              ↓
     Estimated Blood Loss
```

The key engineering challenge is not simply measuring liquid volume.

It is determining:

> **How much of that liquid is actually blood?**

---

# 🚀 Future Development

Potential future improvements include:

### Optical System

* Multi-wavelength illumination
* Dedicated NIR sensing
* Improved reflectance geometry
* Optimized optical path
* Controlled illumination
* Optical reference channel

### Signal Processing

* Advanced filtering
* Sensor fusion
* Statistical calibration
* Machine-learning-based concentration estimation
* Automatic confidence scoring

### Mechanical System

* Custom canister-mounted optical module
* Disposable optical interface
* Anti-fog optical window
* Splash protection
* Foam detection
* Multiple sensing locations

### Measurement System

* More accurate liquid-level sensing
* Canister-specific volume calibration
* Non-cylindrical geometry compensation
* Continuous volume tracking

### Healthcare Integration

* Operation-theatre display integration
* Patient monitoring system integration
* Data logging
* Hospital dashboard
* Clinical database integration

### Validation

Future development should include:

* Larger sample datasets
* Multiple blood concentrations
* Different fluid compositions
* Different canister geometries
* Controlled laboratory validation
* Clinical validation
* Comparison against accepted blood-loss measurement methods

---

# 🔮 Long-Term Vision

The long-term goal is to develop a compact sensing platform capable of providing clinicians with a continuously updated estimate of blood loss during surgery.

```text
              SUCTION CANISTER
                     │
        ┌────────────┴────────────┐
        │                         │
 Optical Blood Measurement    Fluid Measurement
        │                         │
        └────────────┬────────────┘
                     ▼
                Edge Processing
                     │
                     ▼
              Blood Loss (mL)
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Local OT Display       Hospital System
```

The architecture can potentially be extended into a broader intraoperative monitoring platform.

---

# 🛠️ Recommended Repository Structure

```text
Real-Time-Blood-Loss-Measurement/
│
├── README.md
│
├── Firmware/
│   ├── AS7343_Test/
│   │   └── AS7343_Test.ino
│   │
│   ├── Blood_Loss_System/
│   │   └── Blood_Loss_System.ino
│   │
│   └── libraries.txt
│
├── Hardware/
│   ├── Circuit_Diagram.png
│   ├── Block_Diagram.png
│   ├── Optical_Module.png
│   └── Canister_Mount.png
│
├── Mechanical/
│   ├── Optical_Chamber/
│   ├── Sensor_Mount/
│   └── CAD/
│
├── Calibration/
│   ├── Calibration_Data.csv
│   ├── Spectral_Readings.csv
│   └── Calibration_Plots/
│
├── Testing/
│   ├── Raw_Data/
│   ├── Experimental_Results/
│   └── Accuracy_Analysis/
│
├── Documentation/
│   ├── Project_Report.pdf
│   ├── Presentation.pdf
│   └── Research_Notes/
│
├── Images/
│   ├── Prototype.jpg
│   ├── Hospital_Testing.jpg
│   └── Optical_Setup.jpg
│
└── LICENSE
```

---

# 💻 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Real-Time-Blood-Loss-Measurement.git

cd Real-Time-Blood-Loss-Measurement
```

## 2. Install Arduino IDE

Install:

* Arduino IDE
* ESP32 Board Package
* Required Adafruit libraries

## 3. Install Libraries

Required libraries include:

```text
Adafruit AS7343
Adafruit VL53L0X
Adafruit BusIO
Wire
```

## 4. Connect Hardware

Connect the AS7343 and VL53L0X to the ESP32 through I²C.

```text
ESP32
 │
 ├── SDA ───── AS7343 SDA
 │          └─ VL53L0X SDA
 │
 └── SCL ───── AS7343 SCL
            └─ VL53L0X SCL
```

## 5. Upload Firmware

Open:

```text
Firmware/Blood_Loss_System/Blood_Loss_System.ino
```

Configure:

* Canister dimensions
* Optical calibration parameters
* Sensor gain
* Sampling parameters
* LED control parameters

Then upload the firmware to the ESP32.

---

# 📊 Example Configuration

```cpp
#define NUM_SAMPLES 5

#define TANK_HEIGHT_CM 30.0
#define TANK_RADIUS_CM 4.0
```

These values must be replaced with the actual dimensions and calibration parameters of the target canister.

---

# 🔬 Reproducibility

The project is structured to allow researchers and developers to reproduce the prototype.

The repository should contain:

* Firmware
* Circuit diagrams
* Mechanical drawings
* Calibration data
* Experimental datasets
* Test results
* Photographs
* Documentation

This enables future developers to modify the optical configuration, sensor selection, calibration model, and mechanical design.

---

# 👥 Intended Application

The system is being developed for potential use in:

* Operation theatres
* Surgical monitoring
* Blood-loss estimation research
* Medical instrumentation research
* Biomedical engineering laboratories

It is currently intended for **research and prototype development**, not direct clinical deployment.

---

# ⚠️ Medical & Safety Disclaimer

> **This project is an academic/research prototype and is not a certified medical device.**

The system must not be used to make clinical decisions or replace established blood-loss measurement methods.

Before clinical use, the system would require appropriate:

* Laboratory validation
* Clinical validation
* Biocompatibility considerations for patient-contacting components
* Electrical safety testing
* Optical safety evaluation
* Sterilization/cleanability assessment
* Risk management
* Regulatory approval
* Performance validation against accepted clinical reference methods

Real biological samples must be handled according to applicable institutional biosafety procedures.

---

# 👨‍💻 Project Team

### Engineering Team

**Ramachandru J**
B.Tech Electronics & Communication Engineering
SRM Institute of Science and Technology

**Nandhakumar**

### Medical Team

**Dr. Sneha Gupta**

**Dr. Shaswat**

The multidisciplinary team combines embedded/electronics engineering with medical-domain knowledge to address a real clinical problem.

---

# 👨‍🏫 Mentorship & Guidance

Special thanks to:

**Dr. Syed Ismail**
Department of DSBS
SRM Institute of Science and Technology

for providing the opportunity to work on this real-world healthcare engineering problem.

We also acknowledge the guidance of:

**Dr. Swanalatha Ma'am**

**Dr. K. V. Leela Ma'am**

for their medical-domain guidance and support in understanding the clinical environment and requirements.

---

# 🏥 Clinical Collaboration

The project problem was identified through interaction with doctors at:

**SRM Global Hospital, Kattankulathur**

The clinical interaction helped the engineering team understand the practical limitations of conventional blood-loss estimation and guided the development of the proposed sensing architecture.

---

# 🌍 Impact

The project explores how embedded systems, optical sensing, and medical-domain collaboration can be combined to address a practical healthcare challenge.

The intended transformation is:

```text
Subjective Estimation
        ↓
Quantitative Sensing
        ↓
Real-Time Data
        ↓
Better Clinical Information
```

The project demonstrates an important engineering principle:

> **Start with a real clinical problem, understand the workflow directly from domain experts, and then design the technology around the actual requirement.**

---

# 📚 Technical Keywords

```text
Embedded Systems
ESP32
C/C++
Arduino
AS7343
Multi-Spectral Sensing
Optical Sensing
Spectroscopy
Hemoglobin Detection
NIR
Reflectance Sensing
Transmission Sensing
VL53L0X
Time-of-Flight
Liquid Level Measurement
Signal Processing
Sensor Calibration
Sensor Fusion
Real-Time Systems
Medical Instrumentation
Biomedical Engineering
MedTech
Healthcare Technology
Operation Theatre
Surgical Blood Loss
IoT
Medical Device Prototyping
Experimental Validation
```

---

# 📜 License

This project may be released under the **MIT License** for educational and research purposes, subject to the final repository licensing decision.

---

# ⭐ Project Summary

> **A real-time embedded sensing platform that combines multi-spectral optical analysis and liquid-level measurement to estimate blood concentration and blood volume in surgical suction canisters. Developed from a real-world clinical problem identified through hospital interaction and validated through prototype testing with real samples.**

---

## 🔬 Research Direction

The current prototype establishes the foundation for further research into:

**Optical Measurement → Blood Concentration → Fluid Volume → Blood Loss Estimation → Real-Time Surgical Monitoring**

Future work will focus on improving optical geometry, calibration robustness, measurement accuracy, sample variability handling, mechanical integration, and clinical validation.
