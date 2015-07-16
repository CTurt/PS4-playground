function dump(name, base, size) {
	var chunkSize = 0x800 / 4;
	var chunkCount = (size / chunkSize) / 4;
	
	for(var bb = 0; bb < chunkCount; bb++) {
		setBase(base + bb * chunkSize * 4);
		
		var dump_data = "";
		
		for(var aa = 0; aa < chunkSize - 1; aa++) {
			dump_data +=  "0x" + u32[aa].toString(16) + ",";
		}
		
		dump_data += "0x" + u32[chunkSize - 1].toString(16);
		
		fname = "dump.php?name=" + name + "-" + bb;
		
		var request = new XMLHttpRequest();
		request.open("POST", fname, false);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		request.onreadystatechange = function() {
			if(request.readyState == 4) {
				if(request.status == 200 || window.location.href.indexOf("http") == -1) {
					logAdd("upload: success");
				}
				else {
					logAdd("upload fail: " + textStatus);
				}
			}
		}
		
		request.send(dump_data);
	}
}
