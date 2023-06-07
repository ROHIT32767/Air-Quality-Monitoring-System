import numpy as np
import csv

outliers = []
outfile = open('./outlierDetected.csv', 'w')

sample = []


with open('uncalibrated.csv' , 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    i=0
    for row in reader:
        if len(row)>0:
            if i != 0 and row[1]!='' and row[2]!='':
                # co2[row[0]].append(float(row[2]))
                sample.append(float(row[2]))
            i += 1

reffile = open('./calibrated.csv','r')
def detect_outliers_iqr(data):
    thres = 3
    mean = np.mean(data)
    std = np.std(data)
    # print(mean, std)
    # print(lwr_bound, upr_bound)
    with open('uncalibrated.csv' , 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        reader2 = csv.reader(reffile, delimiter=',')
        i=0
        for row in reader:
            row2 = next(reader2)
            z_score = (i-mean)/std
            if len(row)>0:
                if i != 0 and np.abs(z_score) <= thres:
                    print(row[0]+','+row[1]+','+row[2]+','+row2[2],file=outfile)
                i += 1
    return

sample_outliers = detect_outliers_iqr(sample)