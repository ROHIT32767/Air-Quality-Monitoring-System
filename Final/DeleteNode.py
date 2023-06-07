from onem2m import *
uri_cse = "https://esw-onem2m.iiit.ac.in:443/~/in-cse/in-name"

ae = "Team_Name_Here"
cnt = "Container_Name_Here"

uri_ae = uri_cse + "/" + ae
uri_cnt = uri_ae + "/" + cnt
delete(uri_cnt)