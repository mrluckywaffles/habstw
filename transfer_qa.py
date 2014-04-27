import os

basePath = 'website'

allPaths = []
for dirname, dirnames, filenames in os.walk(basePath):
	# print path to all subdirectories first.
	for subdirname in dirnames:
		allPaths.append(os.path.join(dirname, subdirname))
    
    # print path to all filenames.
	for filename in filenames:
		allPaths.append(os.path.join(dirname, filename))
		
indexPaths = list(p for p in allPaths if ("index.html" in p and "qa/" not in p))

for p in allPaths:
	print (p)