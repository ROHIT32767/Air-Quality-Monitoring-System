from ctypes import sizeof
from onem2m import *
import json
import matplotlib.pyplot as plt

node = []
creation_time = []

uri_cse = "http://esw-onem2m.iiit.ac.in:443/~/in-cse/in-name"
ae = "Team_Name_Here"
cnt = "Container_Name_Here"

uri_ae = uri_cse + "/" + ae
uri_cnt = uri_ae + "/" + cnt

response = get_data(uri_ae + "/" + cnt + "?rcn=4")
for data in response["m2m:cnt"]["m2m:cin"][::]:
    node.append(data["con"])
    creation_time.append(data["ct"])

ax = plt.gca()
ax.axes.xaxis.set_ticks([])
plt.xlabel("Time")
plt.ylabel("Node values")
plt.plot(creation_time, node)
plt.show()