import os

basePath = 'website'

dir = os.listdir(basePath)

toDelete = list(i for i in dir if ("qatest" not in i))

for p in toDelete:
	if '.' in p:
		os.remove(p)
	else:
		shutil.rmtree(p)
		
