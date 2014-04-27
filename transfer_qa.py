import os
import shutil

basePath = 'website'
testDir = 'qatest'
testPath = basePath + '/' + testDir

dir = os.listdir(basePath)

toDelete = list(basePath + '/' + i for i in dir if (testDir not in i))

for p in toDelete:
	if '.' in p:
		os.remove(p)
	else:
		shutil.rmtree(p)

toCopy = os.listdir(testPath)

for p in toCopy:
	src = testPath + '/' + p
	dst = basePath + '/' + p
	if '.' in p:
		shutil.copy2(src,dst)
	else:
		shutil.copytree(src,dst)