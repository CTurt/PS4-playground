import os, glob, sys, time, struct


def addr_compare(x, y):
    a1 = int(x.split("-")[1], 16)
    a2 = int(y.split("-")[1], 16)
    if(a1 == a2):
        h1 = int(x.split("-")[2])
        h2 = int(y.split("-")[2])
        return int(h1 - h2)
    if(a1-a2) > 0x10000:
        return int((a1 - a2) / 0x10000)
    return int(a1 - a2)


def get_name(path):
    return (path.split("-")[0])


def append_file(inpath, outpath):
    f = open(inpath,"r")
    newFile = open(outpath, "a+b")
    size = 0;
    for line in f:
        tempList = line.split(',')
            
        for item in tempList:
            try:
                newFile.write(struct.pack("<I", int(item.strip(), 16)))
            except ValueError:
                print "error in " + inpath + ": " + item
                break
            size+=4
    f.close()
    newFile.close()
    return size


files = glob.glob("last_dump/*")
sfiles = sorted(files, cmp=addr_compare)

#print sfiles

dump_name = get_name(sfiles[0])

for fname in sfiles:
    dump_name = get_name(fname)
    append_file(fname, dump_name)

        
    

