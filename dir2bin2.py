import glob, sys, time, struct


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


def get_addr(path):
    return (path.split("-")[1])



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

stamp = time.time()
start_addr = int(get_addr(sfiles[0]), 16)
dump_name = str(stamp) + "_0x" + get_addr(sfiles[0]) + ".sprx"
last_addr = start_addr
print get_addr(sfiles[0])

for fname in sfiles:
    if start_addr != int(get_addr(fname), 16):
        dump_name = str(stamp) + "_0x" + get_addr(fname) + ".sprx"
    append_file(fname, dump_name)

        
    

