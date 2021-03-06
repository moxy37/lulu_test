import os
from pandas import DataFrame
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import math
import sys
import statistics
import mysql.connector

kSize = int(sys.argv[1])
dbName = 'lulu2'

aaaa = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
bbbb = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)

c4 = aaaa.cursor()
c4.execute("DELETE FROM Zones WHERE k=" +  str(kSize))
aaaa.commit()
b4 = bbbb.cursor()

print("Getting from database")
a4 = aaaa.cursor()
a4.execute("SELECT productId, id, ts, x, y, storeId, styleCode, yyyy, mm, dd, styleGroup FROM EpcMovement WHERE styleCode IS NOT NULL AND isExit=0 AND isDeparture=0 AND isSold=0 AND isGhost=0 AND isMissing=0 AND regionId IN ('68ffdfb5-0b11-3a2a-b420-6555940aea0c', '9de7d1da-e3f3-38ca-87df-ea26be486194', '0f2a5717-827c-30b1-921a-40eeb252baec', '45e1ab1b-dded-3d92-a1c4-be2461c26d9b', '55cfdb10-f484-382d-9579-e0b0c658e0aa') AND isDeleted=0 ORDER BY storeId, styleGroup, productId, id, ts")
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
ignoredResults = 0
totalLoad = len(myresultA)
lastId = ''
currentIdCount = 0
lastTS = ''
currentTS = ''
for o in myresultA:
    currentId = o[1]
    currentTS = str(o[9]) + '-' + str(o[8]) + '-' + str(o[7])
    if lastId != currentId:
        #Means we need to restart the counter
        currentIdCount = 0
        lastId = currentId
        lastTS = currentTS
    if currentTS == lastTS:
        currentIdCount = currentIdCount + 1
    else:
        lastTS = currentTS
        currentIdCount = 0
    
    styleGroup = o[10]
    styleCode = o[6]
    productId = o[0]
    storeId = o[5]
    if storeId not in obj:
        obj[storeId] = {}
    if styleGroup not in obj[storeId]:
        obj[storeId][styleGroup] = {}
        obj[storeId][styleGroup]['xSet'] = []
        obj[storeId][styleGroup]['ySet'] = []
        obj[storeId][styleGroup]['productIds'] = []
        obj[storeId][styleGroup]['styleCodes'] = []
    
    if styleCode not in obj[storeId][styleGroup]['styleCodes']:
        obj[storeId][styleGroup]['styleCodes'].append(styleCode)
    if productId not in obj[storeId][styleGroup]['productIds']:
        obj[storeId][styleGroup]['productIds'].append(productId)

    obj[storeId][styleGroup]['xSet'].append(o[3])
    obj[storeId][styleGroup]['ySet'].append(o[4])

    loadProgress = loadProgress + 1
    if(loadProgress%10000==0):
        print("Load " + str(loadProgress) + " of " + str(totalLoad) + " loaded with " + str(ignoredResults) + " ignored")
    

for sId in obj:
    totalTests = len(obj[sId].keys())

    for key in obj[sId]:
        xSet = obj[sId][key]['xSet']
        ySet = obj[sId][key]['ySet']
        testNumber = testNumber + 1
        styleGroup = key
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
                    for pId in obj[storeId][styleGroup]['productIds']:
                        try:
                            b4.execute("INSERT INTO Zones (storeId, zoneNumber, radius, xCenter, yCenter, xMin, yMin, xMax, yMax, inZoneCount, isHome, k, radiusAvg, radiusSD, totalCount, styleCode, productId) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (sId, j, radius, xCenter, yCenter, xMin, yMin, xMax, yMax, inZoneCount, isHome, kSize, radiusAvg, radiusSD, totalCount, styleGroup, pId))
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

c5 = aaaa.cursor()
c5.execute("UPDATE Zones t1 INNER JOIN Products t2 ON t1.productId=t2.sku SET t1.styleCode=t2.styleCode, t1.styleGroup=SUBSTRING(t2.styleName, 1, 16)")
aaaa.commit()