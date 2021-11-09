import os
from pandas import DataFrame
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import math
import sys
import statistics
import mysql.connector

kSize = int(sys.argv[1])

aaaa = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
bbbb = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")

c4 = aaaa.cursor()
c4.execute("DELETE FROM Zones WHERE k=" +  str(kSize))
aaaa.commit()

print("Getting from database")
a4 = aaaa.cursor()
a4.execute("SELECT productId, id, ts, x, y, storeId FROM EpcMovement_Test ORDER BY storeId, productId, id, ts")
print("Finished execute")
obj = dict()
myresultA = a4.fetchall()
print("Finished fetchall starting load")
testNumber = 0
totalTests = 0
failedTests = 0
added = 0
errors = 0
loadProgress = 0
totalLoad = len(myresultA)
for o in myresultA:
    if o[6] not in obj:
        obj[o[6]] = dict()
    if o[1] not in obj[o[6]]:
        obj[o[6]][o[1]] = dict()
        obj[o[6]][o[1]]['xSet'] = []
        obj[o[6]][o[1]]['ySet'] = []
        obj[o[6]][o[1]]['productId'] = o[1]
    obj[o[6]][o[1]]['xSet'].append(o[4])
    obj[o[6]][o[1]]['ySet'].append(o[5])
    loadProgress = loadProgress + 1
    if(loadProgress%10000==0):
        print("Load " + str(loadProgress) + " of " + str(totalLoad) + " loaded")

for sId in obj:
    totalTests = len(obj[sId].keys())

    for key in obj[sId]:
        xSet = obj[sId][key]['xSet']
        ySet = obj[sId][key]['ySet']
        testNumber = testNumber + 1
        productId = key
        try:
            Data = {'x':xSet, 'y': ySet}
            if len(xSet) > kSize:
                df = DataFrame(Data,columns=['x','y'])
                kmeans = KMeans(n_clusters=kSize).fit(df)
                centroids = kmeans.cluster_centers_.tolist()
                totalCount = len(xSet)
                xD = [0] * kSize
                yD = [0] * kSize
                dVal = [0] * kSize
                dCount = [0] * kSize
                dMax = [0] * kSize
                dAvg = []
                for j in range(0, kSize):
                    xD[j] = centroids[j][0]
                    yD[j] = centroids[j][1]
                    dAvg.append([])
                for i in range(0, len(xSet)):
                    x = xSet[i]
                    y = ySet[i]
                    for j in range(0, kSize):
                        dVal[j] = ((xD[j] - x)*(xD[j] - x) + (yD[j] - y)*(yD[j] - y))**0.5
                    lowestIndex = dVal.index(min(dVal))
                    if(dMax[lowestIndex]<dVal[lowestIndex]):
                        dMax[lowestIndex] = dVal[lowestIndex]
                    dAvg[lowestIndex].append(dVal[lowestIndex])
                    dCount[lowestIndex] = dCount[lowestIndex] + 1
                homeIndex = dCount.index(max(dCount))
                for j in range(0, kSize):
                    radius = dMax[j]
                    xCenter = xD[j]
                    yCenter = yD[j]
                    try:
                        radiusAvg = statistics.mean(dAvg[j])
                        radiusSD = statistics.stdev(dAvg[j])
                    except:
                        radiusAvg = 0
                        radiusSD = 0
                        errros = errors + 1
                    xMin = xCenter - radiusAvg - radiusSD*2
                    yMin = yCenter - radiusAvg - radiusSD*2
                    xMax = xCenter + radiusAvg + radiusSD*2
                    yMax = yCenter + radiusAvg + radiusSD*2
                    isHome = 0
                    if(homeIndex == j):
                        isHome = 1
                    k = kSize
                    inZoneCount = dCount[j]
                    b4 = bbbb.cursor()
                    b4.execute("INSERT INTO Zones (storeId, productId, zoneNumber, radius, xCenter, yCenter, xMin, yMin, xMax, yMax, inZoneCount, isHome, k, radiusAvg, radiusSD, totalCount) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (sId, productId, j, radius, xCenter, yCenter, xMin, yMin, xMax, yMax, inZoneCount, isHome, kSize, radiusAvg, radiusSD, totalCount))
                    bbbb.commit()
                added = added + 1
            else:
                failedTests = failedTests + 1
        except:
            errros = errors + 1
        print("Completed " + str(testNumber) + " of " + str(totalTests) + ". Added: " + str(added) + ", Errors : " + str(errors) + ", Not Enough Points: " + str(failedTests))