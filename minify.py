import os

minFlagStart = "<!--jsmin-start-->"
minFlagEnd = "<!--jsmin-end-->"

def minifyJsForIndex(indexPath):
	print (indexPath)
	index = open(indexPath)
	indexRaw = index.read()
	index.close()
	index1, flag, rest = indexRaw.partition(minFlagStart)
	raw, flag, index3 = rest.partition(minFlagEnd)
	
	if len(raw) == 0:
		print ("no changes made")
		return
	
	index2 = "<script src=\"min.js\"></script>"
# 	with open(indexPath, "w") as index:
# 		index.write(index1 + index2 + index3)
	
	min = "";
	print (raw)
	
	chunks = raw.split('"')
	jsPaths = list(p for p in chunks if ".js" in p)
	
	print (jsPaths)


allPaths = []
for dirname, dirnames, filenames in os.walk('website'):
	# print path to all subdirectories first.
	for subdirname in dirnames:
		allPaths.append(os.path.join(dirname, subdirname))
    
    # print path to all filenames.
	for filename in filenames:
		allPaths.append(os.path.join(dirname, filename))
		
indexPaths = list(p for p in allPaths if ("index.html" in p and "qa/" not in p))

for p in indexPaths:
	minifyJsForIndex(p)