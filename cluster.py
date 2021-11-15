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
b4 = bbbb.cursor()

print("Getting from database")
a4 = aaaa.cursor()
a4.execute("SELECT productId, id, ts, x, y, storeId, styleCode FROM EpcMovement WHERE styleCode IS NOT NULL AND isExit=0 ORDER BY storeId, styleCode, productId, id, ts")
print("Finished execute")
obj = {}
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
    styleCode = o[6]
    productId = o[0]
    storeId = o[5]
    if storeId not in obj:
        obj[storeId] = {}
    if styleCode not in obj[storeId]:
        obj[storeId][styleCode] = {}
        obj[storeId][styleCode]['xSet'] = []
        obj[storeId][styleCode]['ySet'] = []
        obj[storeId][styleCode]['productIds'] = []
    
    if productId not in obj[storeId][styleCode]['productIds']:
        obj[storeId][styleCode]['productIds'].append(productId)
    obj[storeId][styleCode]['xSet'].append(o[3])
    obj[storeId][styleCode]['ySet'].append(o[4])
    loadProgress = loadProgress + 1
    if(loadProgress%10000==0):
        print("Load " + str(loadProgress) + " of " + str(totalLoad) + " loaded")
    

for sId in obj:
    totalTests = len(obj[sId].keys())

    for key in obj[sId]:
        xSet = obj[sId][key]['xSet']
        ySet = obj[sId][key]['ySet']
        testNumber = testNumber + 1
        styleCode = key
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
                    for pId in obj[storeId][styleCode]['productIds']:
                        try:
                            b4.execute("INSERT INTO Zones (storeId, zoneNumber, radius, xCenter, yCenter, xMin, yMin, xMax, yMax, inZoneCount, isHome, k, radiusAvg, radiusSD, totalCount, styleCode, productId) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (sId, productId, j, radius, xCenter, yCenter, xMin, yMin, xMax, yMax, inZoneCount, isHome, kSize, radiusAvg, radiusSD, totalCount, styleCode, pId))
                            bbbb.commit()
                        except Exception as e:
                            print(str(e))
                            errros = errors + 1
                added = added + 1
            else:
                failedTests = failedTests + 1
        except:
            errros = errors + 1
        print("Completed " + str(testNumber) + " of " + str(totalTests) + ". Added: " + str(added) + ", Errors : " + str(errors) + ", Not Enough Points: " + str(failedTests))