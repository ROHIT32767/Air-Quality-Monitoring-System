#include <Adafruit_SHT4x.h>
#include <Adafruit_SGP40.h>
#include <Wire.h>
#include <SPI.h>

#include <WiFi.h>
#include <ThingSpeak.h>
#include <HTTPClient.h>

#define PRANA_PIN 19

char *ssid = ":heisrightyouknow:";
char *pass = "ESW_PASS1234";

Adafruit_SHT4x sht4 = Adafruit_SHT4x();
Adafruit_SGP40 sgp;

unsigned long duration, th, tl;
float t, h;
uint16_t sraw;
int32_t voc_index = 0;
sensors_event_t humidity, temp;

int ppm_CO2;

int pm2 = 0, pm10 = 0;

///////////////////////////////////////////////////////
// Server
//////////////////////////////////////////////////////

String Serverpassword = "ProjectSixtyPercent";
String Server_url = "https://indoor-air-pollution-18.onrender.com/api/data/";

void ServerWrite()
{
	HTTPClient http;

	http.begin(Server_url);

	http.addHeader("Content-Type", "application/json");
	String body = "";
	body += "[\"";
	body += Serverpassword;
	body += "\",";
	body += String(ppm_CO2);
	body += ",";
	body += String(voc_index);
	body += ",";
	body += String(t);
	body += ",";
	body += String(h);
	body += ",";
	body += String(pm2);
	body += ",";
	body += String(pm10);
	body += "]";
	Serial.println(body);

	if (http.POST(body) == -1)
		Serial.println("UNABLE TO CONNECT TO THE SERVER");
	http.end();

	delay(500);
}

///////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////
// MQTT
////////////////////////////////////////////////////////

char *Write_Api_Key = "MT7RVJ6QVMI3LO7X";
int channel_ID = 1904939;
WiFiClient client;

////////////////////////////////////////////////////////////////////////////

/// OM2M

String cse_ip = "esw-onem2m.iiit.ac.in";
String cse_port = "443";

String server = "http://" + cse_ip + ":" + cse_port + "/~/in-cse/in-name/";
String ae = "Team-18";
String cnt[] = {"Prana_PM2.5", "Prana_PM10", "CO2_Levels", "VOC_Levels", "Temperature", "Humidity"};

void CreateCIPM2_5()
{
	HTTPClient http;
	http.begin(server + ae + "/" + cnt[0] + "/");
	Serial.println(server + ae + "/" + cnt[0] + "/");
	http.addHeader("X-M2M-Origin", "lp2MgQ:e4A#PT");
	http.addHeader("Content-Type", "application/json;ty=4");
	String body = "{\"m2m:cin\": {\"cnf\": \"application/json\",\"con\": " + String(pm2) + "}}";
	Serial.println(body);

	int response = http.POST(body);
	Serial.println(response);
	if (response == -1)
		Serial.println("Unable to connect");
	http.end();
	delay(100);
}

void CreateCIPM10()
{
	HTTPClient http;
	http.begin(server + ae + "/" + cnt[1] + "/");
	Serial.println(server + ae + "/" + cnt[1] + "/");
	http.addHeader("X-M2M-Origin", "lp2MgQ:e4A#PT");
	http.addHeader("Content-Type", "application/json;ty=4");
	String body = "{\"m2m:cin\": {\"cnf\": \"application/json\",\"con\": " + String(pm10) + "}}";
	Serial.println(body);

	int response = http.POST(body);
	Serial.println(response);
	if (response == -1)
		Serial.println("Unable to connect");
	http.end();
	delay(100);
}

void CreateCICO2()
{
	HTTPClient http;
	http.begin(server + ae + "/" + cnt[2] + "/");
	Serial.println(server + ae + "/" + cnt[2] + "/");
	http.addHeader("X-M2M-Origin", "lp2MgQ:e4A#PT");
	http.addHeader("Content-Type", "application/json;ty=4");
	String body = "{\"m2m:cin\": {\"cnf\": \"application/json\",\"con\": " + String(ppm_CO2) + "}}";
	Serial.println(body);

	int response = http.POST(body);
	Serial.println(response);
	if (response == -1)
		Serial.println("Unable to connect");
	http.end();
	delay(100);
}

void CreateCITemp()
{
	HTTPClient http;
	http.begin(server + ae + "/" + cnt[4] + "/");
	Serial.println(server + ae + "/" + cnt[4] + "/");
	http.addHeader("X-M2M-Origin", "lp2MgQ:e4A#PT");
	http.addHeader("Content-Type", "application/json;ty=4");
	String body = "{\"m2m:cin\": {\"cnf\": \"application/json\",\"con\": " + String(t) + "}}";
	Serial.println(body);

	int response = http.POST(body);
	Serial.println(response);
	if (response == -1)
		Serial.println("Unable to connect");
	http.end();
	delay(100);
}

void CreateCIHum()
{
	HTTPClient http;
	http.begin(server + ae + "/" + cnt[5] + "/");
	Serial.println(server + ae + "/" + cnt[5] + "/");
	http.addHeader("X-M2M-Origin", "lp2MgQ:e4A#PT");
	http.addHeader("Content-Type", "application/json;ty=4");
	String body = "{\"m2m:cin\": {\"cnf\": \"application/json\",\"con\": " + String(h) + "}}";
	Serial.println(body);

	int response = http.POST(body);
	Serial.println(response);
	if (response == -1)
		Serial.println("Unable to connect");
	http.end();
	delay(100);
}

void CreateCIvoc()
{
	HTTPClient http;
	http.begin(server + ae + "/" + cnt[3] + "/");
	Serial.println(server + ae + "/" + cnt[3] + "/");
	http.addHeader("X-M2M-Origin", "lp2MgQ:e4A#PT");
	http.addHeader("Content-Type", "application/json;ty=4");
	String body = "{\"m2m:cin\": {\"cnf\": \"application/json\",\"con\": " + String(voc_index) + "}}";
	Serial.println(body);

	int response = http.POST(body);
	Serial.println(response);
	if (response == -1)
		Serial.println("Unable to connect");
	http.end();
	delay(100);
}

////////////////

unsigned long prev_time;

byte command_frame[9] = {0xAA, 0x02, 0x00, 0x00, 0x00, 0x00, 0x01, 0x67, 0xBB};
byte received_data[9];
int sum = 0;

void send_command(byte command)
{
	command_frame[1] = command;
	int sum = command_frame[0] + command_frame[1] + command_frame[2] + command_frame[3] + command_frame[4] + command_frame[5] + command_frame[8];
	int rem = sum % 256;
	command_frame[6] = (sum - rem) / 256;
	command_frame[7] = rem;
	delay(3000);
	Serial.write(command_frame, 9);
}

bool checksum()
{
	sum = int(received_data[0]) + int(received_data[1]) + int(received_data[2]) + int(received_data[3]) + int(received_data[4]) + int(received_data[5]) + int(received_data[8]);
	if (sum == ((int(received_data[6]) * 256) + int(received_data[7])))
		return true;
	else
		return false;
}
void calculate_pm()
{
	pm2 = int(received_data[4]) * 256 + int(received_data[5]);
	pm10 = int(received_data[2]) * 256 + int(received_data[3]);
	delay(3000);
}

void PM_setup()
{
	send_command(0x01);
}

void PM_Reading()
{
	delay(5000);

	if (millis() - prev_time > 5000)
	{
		send_command(0x02);
		prev_time = millis();
	}

	if (Serial.available())
	{
		Serial.readBytes(received_data, 9);
		if (checksum())
			calculate_pm();
	}
}

void setup()
{
	Serial.begin(9600);

	// while (!Serial)
	// 	delay(10); // will pause Zero, Leonardo, etc until serial console opens

	Serial.println("Adafruit VOC test");
	if (!sht4.begin())
	{
		Serial.println("Couldn't find SHT4x");
		while (1)
			delay(1);
	}
	if (!sgp.begin())
	{
		Serial.println("SGP40 sensor not found :(");
		while (1)
			;
	}

	Serial.println("Found SHT4x sensor");
	Serial.print("Serial number 0x");
	Serial.println(sht4.readSerial(), HEX);

	// You can have 3 different precisions, higher precision takes longer
	sht4.setPrecision(SHT4X_HIGH_PRECISION);
	switch (sht4.getPrecision())
	{
	case SHT4X_HIGH_PRECISION:
		Serial.println("High precision");
		break;
	case SHT4X_MED_PRECISION:
		Serial.println("Med precision");
		break;
	case SHT4X_LOW_PRECISION:
		Serial.println("Low precision");
		break;

		Serial.print("Found SHT4x + SGP40 serial #");
		Serial.print(sgp.serialnumber[0], HEX);
		Serial.print(sgp.serialnumber[1], HEX);
		Serial.println(sgp.serialnumber[2], HEX);
	}

	// You can have 6 different heater settings
	// higher heat and longer times uses more power
	// and reads will take longer too!
	sht4.setHeater(SHT4X_NO_HEATER);
	switch (sht4.getHeater())
	{
	case SHT4X_NO_HEATER:
		Serial.println("No heater");
		break;
	case SHT4X_HIGH_HEATER_1S:
		Serial.println("High heat for 1 second");
		break;
	case SHT4X_HIGH_HEATER_100MS:
		Serial.println("High heat for 0.1 second");
		break;
	case SHT4X_MED_HEATER_1S:
		Serial.println("Medium heat for 1 second");
		break;
	case SHT4X_MED_HEATER_100MS:
		Serial.println("Medium heat for 0.1 second");
		break;
	case SHT4X_LOW_HEATER_1S:
		Serial.println("Low heat for 1 second");
		break;
	case SHT4X_LOW_HEATER_100MS:
		Serial.println("Low heat for 0.1 second");
		break;
	}

	WiFi.begin(ssid, pass);
	Serial.print(".");
	delay(3000);
	while (WiFi.status() != WL_CONNECTED)
	{
		WiFi.begin(ssid, pass);
		Serial.print(".");
		delay(3000);
	}

	Serial.println("Connected to WIFI");
	ThingSpeak.begin(client);

	// delay(5000);

	PM_setup();

	for (int i = 0; i < 500; i++)
	{
		sht4.getEvent(&humidity, &temp); // populate temp and humidity objects with fresh data

		t = temp.temperature;
		h = humidity.relative_humidity;

		sraw = sgp.measureRaw(t, h);
		voc_index = sgp.measureVocIndex(t, h);
		Serial.print("Voc Index: ");
		Serial.println(voc_index);
		Serial.println(i);
		delay(10);
	}

	PM_Reading();
}

void loop()
{
	while (voc_index == 0)
	{
		uint32_t timestamp = millis();
		sht4.getEvent(&humidity, &temp); // populate temp and humidity objects with fresh data
		timestamp = millis() - timestamp;

		t = temp.temperature;
		h = humidity.relative_humidity;
		Serial.print("Temperature: ");
		Serial.print(t);
		Serial.println(" degrees C");
		Serial.print("Humidity: ");
		Serial.print(h);
		Serial.println("% rH");

		Serial.print("Read duration (ms): ");
		Serial.println(timestamp);

		sraw = sgp.measureRaw(t, h);
		Serial.print("Raw measurement: ");
		Serial.println(sraw);

		voc_index = sgp.measureVocIndex(t, h);
		Serial.print("Voc Index: ");
		Serial.println(voc_index);
	}

	uint32_t timestamp = millis();
	sht4.getEvent(&humidity, &temp); // populate temp and humidity objects with fresh data
	timestamp = millis() - timestamp;

	t = temp.temperature;
	h = humidity.relative_humidity;
	Serial.print("Temperature: ");
	Serial.print(t);
	Serial.println(" degrees C");
	Serial.print("Humidity: ");
	Serial.print(h);
	Serial.println("% rH");

	Serial.print("Read duration (ms): ");
	Serial.println(timestamp);

	sraw = sgp.measureRaw(t, h);
	Serial.print("Raw measurement: ");
	Serial.println(sraw);

	voc_index = sgp.measureVocIndex(t, h);
	Serial.print("Voc Index: ");
	Serial.println(voc_index);

	th = pulseIn(PRANA_PIN, HIGH, 2008000) / 1000;
	tl = 1004 - th;
	ppm_CO2 = 2000 * (th - 2) / (th + tl - 4);

	Serial.print("Co2 Concentration: ");
	Serial.println(ppm_CO2);

	PM_Reading();

	int flag = 0;

	while (WiFi.status() != WL_CONNECTED)
	{
		WiFi.begin(ssid, pass);
		Serial.print(".");
		delay(3000);
		flag = 1;
	}

	if (flag)
	{
		Serial.println("Connected to WIFI");
		ThingSpeak.begin(client);
	}

	ThingSpeak.setField(1, pm2);
	ThingSpeak.setField(2, pm10);
	ThingSpeak.setField(3, ppm_CO2);
	ThingSpeak.setField(4, t);
	ThingSpeak.setField(5, h);
	ThingSpeak.setField(6, voc_index);
	ThingSpeak.writeFields(channel_ID, Write_Api_Key);
	delay(3000);

	CreateCIPM2_5();
	CreateCIPM10();
	CreateCICO2();
	CreateCITemp();
	CreateCIHum();
	CreateCIvoc();

	ServerWrite();

	delay(60000);
}
