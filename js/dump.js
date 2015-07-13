function dump(name, base, size) {
	var chunkSize = 0x1000 / 4;
	var chunkCount = size / chunkSize;
	
	var xx = base;
	setBase(xx);
	
	for(var bb = 0; bb < chunkCount; bb++) {
		var dump_data = "";
		
		for(var aa = 0; aa < (chunkSize - 1); aa++) {
			dump_data +=  "0x" + u32[(bb * chunkSize) + aa].toString(16) + ",";
		}
		
		dump_data += u32[(chunkSize - 1)].toString(16);
		
		fname = "dump.php?name=" + name + "-" + bb;
		$.ajax({
			async : false,
			url : fname,
			type: "POST",
			data : dump_data,
			success: function(data, textStatus, jqXHR) {
				logAdd("upload: success");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				logAdd("upload fail: " + textStatus);
			}
		});
	}
}
