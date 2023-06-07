# Prana Air PM Sensor:

## General details:
- Power input - `5V`
- Data transfer through Rx and Tx - `3.3V`
- Particle size resolution - `0.3µm`
- Units - `µg/m3`
- Communication type - `UART`

## Configuration types:
- Baud rate - `9600`
- Data bits - `8`
- Stop bit - `1`
- No parity bit

## Pros of this sensor:
- Values of higher sizes include values of lower particle sizes also
- Mean time of failure `>= 30000 hours`
- Working temperature - `-20°C to 70°C`
- Operating humidity - `0 to 90% RH (non-condensing)`
- `PM2.5` readings are given to be strictly calibrated
- Draws less current of `70mA`

## Working mechanism:
- This sensor works on the principle of `90° light scattering technique`, which helps in determining particle sizes
- Air enters the sensor and particles interact with the LASER beam striking the mirror aperture in the sensor
- The photodiode in the sensor captures the light scattered by the particles which leads to the generation of a signal
- The particle count and mass cam be obtained from this signal

<hr>

# Prana Air NDIR CO2 Sensor:

## General details:
- `NDIR` - Non-Dispersive InfraRed
- Measurement range - `0 to 10000 ppm`
- Resolution - `1 ppm`
- Units - `ppm`
- Input voltage - `5V`

## Configuration types:
- Both `PWM` (Pulse Width Modulation - We used this) and `UART` modes of communication exist
- Our code is written such that the sensor is configured to sense between `0` and `2000` as we set cycle length of PWM mode to `1004ms = (2 + 1000 + 2 ms)` (High level cycle + Middle level cycle + Low level cycle lengths)

## Pros of this sensor:
- Sensor has self-calibration cycle every `4 days`
- Zero point of sensor is `400ppm`
- Working temperature - `0°C to 50°C`
- Operating humidity - `0 to 95% RH (non-condensing)`
- Draws less current of `20mA`

## Working mechanism:
- Gas enters the sensor
- Sensor emits IR waves which are absorbed by the CO2 particles at a wavelength of `4.26 µm`
- The level of absorption is directly proportional to number of CO2 molecules and thus their concentration

<hr>

# Adafruit SGP40 + SHT4x Sensor:

## Working mechanism:
- Uses heater that controls hotplate T-sensors and heater controllers (both analog)
- Uses MOx material that handles analog frontend (data reading) by reacting with hydrocarbons in the air and gives the raw measurement
- System controller (digital) uses data from on-chip memory (digital) and interacts with heater controllers along with the analog frontend to handle signal processing (digital) which interacts with the I2C interface
- Raw measurement is obtained from raw signal `SRAW` which is directly proportional to the logarithm of the resistance of the MOx material
- Takes `30ms` to take one measurement

## General details:
- Units of raw measurement - `µg/m3`
- VOC Index - `No units`
- SCL clock frequency - `400 kHz`
- Working temperature - `-20°C to 55°C`
- Operating humidity - `0 to 90% RH (non-condensing)`
- Input volatge - Both `5V` and `3.3V` are supported
- `3.3V` pin can support upto `100mA`
- I2C bus level voltage limits - `1.7-3.6V`

## Configuration types:
- Communication protocol - `I2C` with address `0x59`
- RAW measurement is provided as a `16-bit` word followed by one `CRC` (Cyclic Redundancy Check) bit
- SRAW is sent to the processing algorithm at a sampling rate of `1Hz`
- I2C supports standard and fast modes with maximum clock frequencies `100 kHz` and `400 kHz` respectively

## Pros of this sensor:
- The digital signal processing also handles humidity compensation
- Voltage regulator is added for the `5V` pin so that any voltage from `3-5V` is safely brought to the appropriate voltage levels
- Working temperature - `-10°C to 50°C`
- Operating humidity - `0 to 90% RH (non-condensing)` including humidity compensation
- Has a self-test for measured values 
- Does not contain materials that are harmful to the environment such as `Pb`, `Cd`, `Hg` and halogens

<hr>

# VOC:

- VOC Index is the state of the reading of the sensor relative to the previous values of the sensor
-  Hence, VOC Index value of `100` denotes average readings and typical gas composition over the past `24` hours. `< 100` shows air quality is better than average and `> 100` shows air quality is worse compared to average

- VOCs can also enter a building via polluted outdoor air.

- Sources:
    - paints, paint strippers and other solvents
    - wood preservatives
    - aerosol sprays
    - cleansers and disinfectants
    - moth repellents and air fresheners
    - stored fuels and automotive products

<hr>

# CO2:

- Sources:
    - Use of any type of unvented fuel-burning space heater, such as a kerosene, natural gas, or propane heater will result in elevated levels. 
    - High levels also can occur when several people are in a poorly ventilated room
    - Tobacco smoke and outdoor air

- Permissible Limits:
    - Outdoor air concentrations normally vary from 320-400 ppm
    - Complaints of poor indoor air quality are unusual if Co2 concentrations are less than 700-800 ppm
    - In crowded and underventilated rooms , CO2 levels may rise to 2000-5000 ppm
    - Indoor CO2 concentration of less than 1000ppm indicate fresh air supply

<hr>

# PM
- Sources:
    - woodstoves, pellet stove, gas stoves, kerosene heaters, gas space heaters
    - Candles, incense, electric oil diffusers/pad diffusers and air fresheners 
    - Vacuum cleaners without HEPA filtration
    - pollens, mold spores, dust mites and cockroaches
    - 3D printers, laser cutters, and soldering

- Permissible Limits:
    - The short-term standard (24-hour or daily average) is 35 micrograms per cubic meter of air (µg/m3) and the long-term standard (annual average) is 12 µg/m3. A microgram is a unit of weight. There are a million micrograms in a gram, and a pound is equal to about 450 grams.

<hr>

# Frontend
- Core Framework used: React
    * Easy Dynamic data loading and dynamic rendering
    * Conditional rendering

- Charts framework: ChartJS
    * Easy to customize and use

- CSS Framework: Tailwinded
    * Ready made templates available
    * Easy cutomisation
    * Fast coding

# Backend
- Why a backend when you have OM2M and Thingspeak?
    * We wanted to send active email alerts to users, Which is not possible in OM2M/Thingspeak
    * Thingspeak is unreliable (Slow http response and missing data)
    * OM2M hangs when it holds large data volumes
- NodeJS:
    * Along with a dashboard , We also provided api's to get our data from ourt server, which can be used by any other developer.
    * automated emails using nodemailer
- MongoDB:
    * To store large data amounts , without issues