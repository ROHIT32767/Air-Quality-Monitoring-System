# 1. Sources of VOC, CO2 and PM:

## Sources of VOC:

- paints, paint strippers and other solvents
- wood preservatives
- aerosol sprays
- cleansers and disinfectants
- moth repellents and air fresheners
- stored fuels and automotive products

## Sources of CO2:

- Use of any type of unvented fuel-burning space heater, such as a kerosene, natural gas, or propane heater will result in elevated levels. 
- High levels also can occur when several people are in a poorly ventilated room
- Tobacco smoke and outdoor air

## Sources of PM:

- woodstoves, pellet stove, gas stoves, kerosene heaters, gas space heaters
- Candles, incense, electric oil diffusers/pad diffusers and air fresheners 
- Vacuum cleaners without HEPA filtration
- pollens, mold spores, dust mites and cockroaches
- 3D printers, laser cutters, and soldering

<hr>

# 2. Why are PM sensor readings same for PM 2.5 and PM 10?

- PM sensor readings for a size are cumulative readings and involve values of lower particle sizes as well for higher particle sizes, i.e., PM 2.5 also include PM1 values. PM 5 includes PM 1 and PM 2.5 and finally PM 10 includes all of PM 1, PM 2.5 and PM 5 as well
- Thus PM 10 values only get different when there is a significant increase in particles of size > `5µm`

<hr>

# 3. Contributions:

- Abhinav: `Dashboard - Frontend and Backend`
- Rohit: `Hardware and Sensor code`
- Gnana Prakash: `Sensor, Thingspeak and OM2M codes`
- LSA Mourya: `Data Analysis, Reports and Slides`

<hr>

# 4. Problems faced:

- Had to solder another wire to PM wires as they broke and were weak
- Few wires had to be resoldered due to them getting shorted
- PCB layout as we used a smaller PCB
- Finding a suitable service to host our website on
- Getting email alerts to work: We had to create another email to send the email alerts from
- We implemented verification from user side of the email to ensure they do not get spammed

<hr>

# 5. Sensor configuration type:

## PM Sensor:
- Communication type - `UART`
- Baud rate - `9600`
- Data bits - `8`
- Stop bit - `1`
- No parity bit

## CO2 Sensor:
- Both `PWM` (Pulse Width Modulation - We used this) and `UART` modes of communication exist
- Our code is written such that the sensor is configured to sense between `0` and `2000` as we set cycle length of PWM mode to `1004ms = (2 + 1000 + 2 ms)` (High level cycle + Middle level cycle + Low level cycle lengths)

## VOC Sensor:
- Communication protocol - `I2C` with address `0x59`
- RAW measurement is provided as a `16-bit` word followed by one `CRC` (Cyclic Redundancy Check) bit
- SRAW is sent to the processing algorithm at a sampling rate of `1Hz`
- I2C supports standard and fast modes with maximum clock frequencies `100 kHz` and `400 kHz` respectively

<hr>

# 6. Units of sensors:
- PM - `µg/m3`
- VOC raw measurement - `µg/m3`
- VOC Index - `No units`
- CO2 Units - `ppm`

<hr>

# 7. Why we selected these Sensors?

- Our Sensors have good accuracy, low cost and compatible as compared with other sensors

## Pros of PM sensor:
- Values of higher sizes include values of lower particle sizes also
- Mean time of failure `>= 30000 hours`
- Working temperature - `-20°C to 70°C`
- Operating humidity - `0 to 90% RH (non-condensing)`
- `PM2.5` readings are given to be strictly calibrated
- Draws less current of `70mA`

## Pros of CO2 sensor:
- Sensor has self-calibration cycle every `4 days`
- Zero point of sensor is `400ppm`
- Working temperature - `0°C to 50°C`
- Operating humidity - `0 to 95% RH (non-condensing)`
- Draws less current of `20mA`

## Pros of SGP40 sensor:
- The digital signal processing also handles humidity compensation
- Voltage regulator is added for the `5V` pin so that any voltage from `3-5V` is safely brought to the appropriate voltage levels
- Working temperature - `-10°C to 50°C`
- Operating humidity - `0 to 90% RH (non-condensing)` including humidity compensation
- Has a self-test for measured values 
- Does not contain materials that are harmful to the environment such as `Pb`, `Cd`, `Hg` and halogens

<hr> 

# 9. Caibration Basics:
- All measurement instruments measure wrong and calibration tells how wrong they are
- Calibration process is carried out when the machine or tool is new
- Calibration is not a one time process. It is carried out again on a pre-determined frequency to check for errors that may occur due to the equipment’s wear and tear.
- We used linear regression
- It gives a line of the form `y = ax + b`, where y shows the reference values and x shows the measured values
- a and b are such that the sum of the squares of the data points from the line are minimised

<hr>

# 10. Different types of calibration:
- Linear regression
- Polynomial regression
- We used linear instead of polynomial even though polynomial is more effective because linear is more immune against outliers and and more robust

# 11. Significance of calibration:
- Calibration is important because it helps ensure accurate measurements, and accurate measurements are foundational to the 
 quality, safety and innovation of most products and services we use and rely on every day
- Biggest challenege in the field of IoT is obtaining correct and valid data readings over long periods.
- Major challenge is to be able to correct shift of sensor systems
- Calibration is used to correct this shift and ensure that correct readings are taken
- The correction is done with a commonly agreed upon gold standard for measurement in an ambient and controlled environment

<hr>

# 12. Reference sensor used and its datasheet:
- We used a calibrated Prana Air NDIR CO2 Sensor from our labs as our reference
- It is the same sensor we are using
- The link to the datasheet: https://www.pranaair.com/wp-content/uploads/2021/07/prana-air-co2-sensor-brochure-and-datasheet.pdf

<hr>

# 13. Outlier detection:
-  Outlier detection invloves the elimination of values which are very far from the mean of the samples
- The name `outlier` is given as it rightly describes the data points not fitting well with the other observed data samples
- We used `Inter Quartile Range (IQR)` scheme to detect outliers and they have been removed from our collected samples accordingly
- Other methods of outlier detection include: `Z-Score` and `Boxplot`

## IQR
Inter Quartile Range (IQR) is one of the most extensively used procedure for outlier detection and removal. According to this procedure, we need to follow the following steps:

Find the first quartile, Q1.
Find the third quartile, Q3.
Calculate the IQR. IQR = Q3-Q1.
Define the normal data range with lower limit as Q1–1.5*IQR and upper limit as Q3+1.5*IQR.
Any data point outside this range is considered as outlier and should be removed for further analysis

## Box-plot
In boxplot, this IQR method is implemented to detect any extreme data point where the maximum point (the end of high whisker) is Q3+1.5*IQR and the minimum point (the start of low whisker) is Q1–1.5*IQR.

## Z-score 
Z-score is just another form of standard deviation procedure. Z-score is used to convert the data into another dataset with mean = 0.
Here, X-bar is the mean value and s is standard deviation. Once the data is converted, the center becomes 0 and the z-score corresponding to each data point represents the distance from the center in terms of standard deviation. For example, a z-score of 2.5 indicates that the data point is 2.5 standard deviation away from the mean. Usually z-score =3 is considered as a cut-off value to set the limit. Therefore, any z-score greater than +3 or less than -3 is considered as outlier which is pretty much similar to standard deviation method.

<hr>