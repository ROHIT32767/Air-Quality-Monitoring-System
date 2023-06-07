from onem2m import *
uri_cse = "https://esw-onem2m.iiit.ac.in:443/~/in-cse/in-name"

ae = "Team_Name_Here"
cnt = "Container_Name_Here"

create_ae(uri_cse, ae)
uri_ae = uri_cse + "/" + ae

create_cnt(uri_ae, cnt)
uri_cnt = uri_ae + "/" + cnt
create_data_cin(uri_cnt, 1)