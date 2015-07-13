function dump(base, chunkCount, chunkSize) {
	chunkSize /= 4;
	
	var xx = base;
	setBase(xx);
	
	for(var bb = 0; bb < chunkCount; bb++) {
		var dump_data = "";
		
		for(var aa = 0; aa < (chunkSize - 1); aa++) {
			dump_data +=  "0x" + u32[(bb * chunkSize) + aa].toString(16) + ",";
		}
		
		dump_data += u32[(chunkSize - 1)].toString(16);
		
		fname = "dump.php?name=dump-0x" + xx.toString(16) + "-" + bb;
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
