import os
import datetime

minFlagStart = "<!--jsmin-start-->"
minFlagEnd = "<!--jsmin-end-->"
basePath = '.'
intro = (
	'// last updated '
	+ datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	+ '\n\n')

def minifyJsForIndex(indexPath):
# 	print (indexPath)
	index = open(indexPath)
	indexRaw = index.read()
	index.close()
	index1, flag, rest = indexRaw.partition(minFlagStart)
	raw, flag, index3 = rest.partition(minFlagEnd)
	
	if len(raw) == 0:
# 		print ("no changes made")
		return
	
	index2 = "<script src=\"assets/min.js\"></script>"
	with open(indexPath, "w") as f:
		f.write(index1 + index2 + index3)
	
	min = "";
# 	print (raw)
	
	chunks = raw.split('"')
	jsPaths = list((basePath + '/' + p) for p in chunks if ".js" in p)
	
# 	print (jsPaths)
	
	for p in jsPaths:
		with open(p) as f:
			min += f.read();
	
	minPath = indexPath.partition("index.html")[0] + "assets/min.js"
	with open(minPath, "w") as f:
		f.write(intro + min)
		
	#done

allPaths = []
for dirname, dirnames, filenames in os.walk(basePath):
	# print path to all subdirectories first.
	for subdirname in dirnames:
		allPaths.append(os.path.join(dirname, subdirname))
    
    # print path to all filenames.
	for filename in filenames:
		allPaths.append(os.path.join(dirname, filename))
		
indexPaths = list(p for p in allPaths if ("index.html" in p and "qatest" not in p))

for p in indexPaths:
	minifyJsForIndex(p)