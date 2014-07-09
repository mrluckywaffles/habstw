import os
import shutil

basePath = ''
testDir = 'qatest'
toolsDir = 'tools'
testPath = basePath + '/' + testDir

base_dir = os.listdir(basePath)
qa_dir = os.listdir(testPath)

toDelete = list(basePath + '/' + i for i in base_dir if (testPath + '/' + i in qa_dir))

for p in toDelete:
	if '.' in p:
		os.remove(p)
	else:
		shutil.rmtree(p)

for p in qa_dir:
	src = testPath + '/' + p
	dst = basePath + '/' + p
	if '.' in p:
		shutil.copy2(src,dst)
	else:
		shutil.copytree(src,dst)